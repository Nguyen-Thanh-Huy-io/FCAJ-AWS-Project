const facebookWebhookService = require('../../services/social/facebook/facebook-webhook.service');
const logger = require('../../utils/logger');
const crypto = require('crypto');

class FacebookWebhookController {
  verifyWebhook = (req, res) => {
    try {
      const mode = req.query['hub.mode'];
      const token = req.query['hub.verify_token'];
      const challenge = req.query['hub.challenge'];

      const verifyToken = process.env.FACEBOOK_VERIFY_TOKEN;

      if (mode === 'subscribe' && token === verifyToken) {
        logger.info('[Facebook Webhook] Verification successful.');
        return res.status(200).send(challenge);
      } else {
        logger.warn('[Facebook Webhook] Verification failed. Token mismatch.');
        return res.sendStatus(403);
      }
    } catch (error) {
      logger.error('[Facebook Webhook] Error in verification:', error);
      return res.sendStatus(500);
    }
  };

  handleWebhookEvent = (req, res) => {
    try {
      const payload = req.body;
      logger.info('[Facebook Webhook] Event received:', JSON.stringify(payload));

      // Respond immediately to Meta to avoid timeouts (Meta expects 200 OK within 3s)
      res.status(200).send('EVENT_RECEIVED');

      // Process the event asynchronously
      facebookWebhookService.processEvent(payload).catch(err => {
        logger.error('[Facebook Webhook Service] Error processing event asynchronously:', err);
      });
    } catch (error) {
      logger.error('[Facebook Webhook] Error handling event:', error);
      // We still return 200 if possible or avoid crashing
      if (!res.headersSent) {
        res.status(200).send('EVENT_RECEIVED');
      }
    }
  };

  handleDataDeletionWebhook = async (req, res) => {
    try {
      const signedRequest = req.body.signed_request;
      if (!signedRequest) {
        return res.status(400).send('Missing signed_request');
      }

      const secret = process.env.FACEBOOK_APP_SECRET;
      if (!secret) {
        logger.error('[Facebook Data Deletion] Missing FACEBOOK_APP_SECRET');
        return res.status(500).send('Internal Server Error');
      }

      // 1. Decode the signed_request
      const [encodedSig, payload] = signedRequest.split('.', 2);

      // Base64URL decode
      const sig = Buffer.from(encodedSig.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
      const data = JSON.parse(Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));

      // 2. Validate the signature
      if (data.algorithm !== 'HMAC-SHA256') {
        return res.status(400).send('Unknown algorithm');
      }

      const expectedSig = crypto.createHmac('sha256', secret).update(payload).digest();

      if (!crypto.timingSafeEqual(sig, expectedSig)) {
        logger.warn('[Facebook Data Deletion] Bad signature');
        return res.status(400).send('Bad signature');
      }

      const userId = data.user_id; // Meta User ID

      logger.info(`[Facebook Data Deletion] Received request for Meta User ID: ${userId}`);

      // 3. Process deletion via service
      const deletionTicket = await facebookWebhookService.processDataDeletion(userId);

      // 4. Respond to Meta
      // Meta requires a JSON response containing a status url and alphanumeric confirmation code
      const responsePayload = {
        url: `${process.env.FRONTEND_URL || 'https://publicast.com'}/data-deletion?ticket=${deletionTicket}`,
        confirmation_code: deletionTicket
      };

      res.status(200).json(responsePayload);
    } catch (error) {
      logger.error('[Facebook Data Deletion] Error handling webhook:', error);
      res.status(500).send('Internal Server Error');
    }
  };
}

module.exports = new FacebookWebhookController();
