import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const DataDeletion = () => {
  useEffect(() => {
    document.title = "Data Deletion Instructions - PubliCast";
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <header className="bg-zinc-900 text-white py-6">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tight hover:opacity-80">
            PubliCast
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 text-zinc-800">
        <h1 className="text-4xl font-bold mb-6">User Data Deletion Instructions</h1>
        <p className="text-lg text-zinc-600 mb-10">
          PubliCast allows you to connect your social media accounts (like Facebook, Instagram, YouTube) to manage posts and view analytics. 
          If you no longer want to use our app or wish to remove your data from our servers, you can follow the steps below.
        </p>

        <div className="space-y-12">
          {/* Method 1: Within the App */}
          <section className="bg-zinc-50 p-8 rounded-2xl border border-zinc-200">
            <h2 className="text-2xl font-semibold mb-4">Method 1: Disconnect via PubliCast Dashboard</h2>
            <p className="mb-4 text-zinc-600">The easiest way to remove a specific social account and its related data from our system is to disconnect it directly within the app.</p>
            <ol className="list-decimal pl-6 space-y-3 text-zinc-800">
              <li>Log in to your PubliCast account.</li>
              <li>Navigate to the <strong>Settings</strong> or <strong>Connections</strong> page from the sidebar.</li>
              <li>Find the social account (e.g., Facebook Page) you wish to remove.</li>
              <li>Click the <strong>Disconnect</strong> or <strong>Remove</strong> button next to the account.</li>
              <li>Confirm the action. This will immediately delete the access token and stop fetching any new analytics for that account.</li>
            </ol>
          </section>

          {/* Method 2: Facebook Specific */}
          <section className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100">
            <h2 className="text-2xl font-semibold mb-4 text-blue-900">Method 2: Remove App via Facebook (Automated Callback)</h2>
            <p className="mb-4 text-zinc-600">
              You can revoke PubliCast's access directly from your Facebook settings. When you do this, Facebook sends us an automated webhook (Data Deletion Request), and we will automatically wipe your Facebook-related data from our servers.
            </p>
            <ol className="list-decimal pl-6 space-y-3 text-zinc-800">
              <li>Go to your Facebook account's <strong>Settings & Privacy</strong> &gt; <strong>Settings</strong>.</li>
              <li>In the left menu, click on <strong>Apps and Websites</strong>.</li>
              <li>Find <strong>PubliCast</strong> in the list of active apps.</li>
              <li>Click the <strong>Remove</strong> button.</li>
              <li>Check the boxes if you want to delete past posts made by PubliCast, and click <strong>Remove</strong> again to confirm.</li>
            </ol>
            <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200 text-sm text-blue-800">
              <strong>Note:</strong> Once removed, Facebook will trigger a callback to our servers, and all your Facebook access tokens and cached Page data will be permanently deleted from our database.
            </div>
          </section>

          {/* Method 3: Complete Account Deletion */}
          <section className="bg-red-50/50 p-8 rounded-2xl border border-red-100">
            <h2 className="text-2xl font-semibold mb-4 text-red-900">Method 3: Request Complete Account Deletion</h2>
            <p className="mb-4 text-zinc-600">
              If you want to completely delete your PubliCast account, including all personal information, brand settings, and history across all platforms:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-zinc-800 mb-6">
              <li>Send an email to <a href="mailto:support@publicast.com" className="font-semibold text-red-700 hover:underline">support@publicast.com</a> from the email address registered with your account.</li>
              <li>Use the subject line: <strong>Account Deletion Request</strong>.</li>
              <li>We will process your request and permanently delete all your data within 7 business days.</li>
            </ul>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-50 border-t border-zinc-200 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} PubliCast Global. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
