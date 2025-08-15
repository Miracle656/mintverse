@@ .. @@
 import React from 'react';
 import { usePrivy, useLogin } from '@privy-io/react-auth';
 import { useAccount } from 'wagmi';
-import '../index.css';
+import { useProfile } from '../hooks/useProfile';

 const WalletConnect = () => {
   const { ready, authenticated, logout } = usePrivy();
   const { login } = useLogin();
   const { address } = useAccount();
+  const { profile } = useProfile();

   const isLoginDisabled = !ready || (ready && authenticated);
@@ .. @@
   const buttonText = authenticated ? (address?.slice(0, 6) + '...' + address?.slice(-4) || 'Logout') : 'Connect Wallet';

   return (
-    <div className="flex justify-center">
-      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
+    <div className="flex items-center space-x-4">
+      {authenticated && profile && (
+        <div className="flex items-center space-x-2">
+          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
+            {profile.avatar_url ? (
+              <img
+                src={profile.avatar_url}
+                alt="Avatar"
+                className="w-full h-full rounded-full object-cover"
+              />
+            ) : (
+              <span className="text-xs font-medium text-gray-600">
+                {profile.username?.charAt(0) || 'U'}
+              </span>
+            )}
+          </div>
+          <span className="text-sm font-medium text-white">
+            {profile.username || 'User'}
+          </span>
+        </div>
+      )}
+      
+      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-3">
         {authenticated ? (
-          <div className="text-center space-y-4">
-            <div className="flex items-center justify-center space-x-3">
-              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
-              <span className="text-sm font-medium text-gray-600">Connected to Base Network</span>
-            </div>
-            
-            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
-              <p className="text-xs text-gray-500 mb-1">Wallet Address</p>
-              <p className="font-mono text-sm text-gray-800 break-all">{address}</p>
-            </div>
-            
-            <button
-              onClick={handleButtonClick}
-              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
-            >
-              Disconnect Wallet
-            </button>
-          </div>
+          <button
+            onClick={handleButtonClick}
+            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm"
+          >
+            Disconnect
+          </button>
         ) : (
-          <div className="text-center space-y-4">
-            <div className="flex items-center justify-center space-x-3">
-              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
-              <span className="text-sm font-medium text-gray-600">Not Connected</span>
-            </div>
-            
-            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
-              <p className="text-sm text-gray-600">Connect your wallet to start creating and trading coins</p>
-            </div>
-            
-            <button
-              disabled={isLoginDisabled}
-              onClick={handleButtonClick}
-              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
-            >
-              <div className="flex items-center justify-center space-x-2">
-                <span>🔗</span>
-                <span>{buttonText}</span>
-              </div>
-            </button>
-          </div>
+          <button
+            disabled={isLoginDisabled}
+            onClick={handleButtonClick}
+            className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
+          >
+            Connect Wallet
+          </button>
         )}
       </div>
     </div>