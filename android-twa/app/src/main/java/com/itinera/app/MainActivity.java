package com.itinera.app;

import android.app.Activity;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.Manifest;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

/**
 * MainActivity - WebView-based app that displays your website inside the app.
 * Optimized for perfect mobile display alignment.
 */
public class MainActivity extends Activity {

    // ========================================
    // CHANGE THIS URL TO YOUR DEPLOYED WEBSITE
    // ========================================
    private static final String WEBSITE_URL = "https://itinera-xi.vercel.app/";

    private static final String CHANNEL_ID = "itinera_notifications";
    private static final int NOTIFICATION_ID = 1001;

    private WebView webView;
    private ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Make app fullscreen with edge-to-edge display
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(
                WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);

        // Make status bar transparent and content go behind it
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().setStatusBarColor(Color.TRANSPARENT);
            getWindow().setNavigationBarColor(Color.BLACK);
        }

        // Enable edge-to-edge display
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            getWindow().setDecorFitsSystemWindows(false);
        } else {
            getWindow().getDecorView().setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
                            View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
                            View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
                            View.SYSTEM_UI_FLAG_FULLSCREEN |
                            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
        }

        setContentView(R.layout.activity_main);

        // Initialize views
        webView = findViewById(R.id.webView);
        progressBar = findViewById(R.id.progressBar);

        // Configure WebView for perfect mobile display
        configureWebView();

        // Create notification channel and show welcome notification
        createNotificationChannel();
        showWelcomeNotification();

        // Load the website
        webView.loadUrl(WEBSITE_URL);
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "Itinera Notifications";
            String description = "Notifications from Itinera travel app";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;

            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
            channel.setDescription(description);
            channel.enableLights(true);
            channel.setLightColor(Color.parseColor("#FF6B35"));

            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    private void showWelcomeNotification() {
        // Check notification permission for Android 13+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this,
                    Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                // Request permission
                requestPermissions(new String[] { Manifest.permission.POST_NOTIFICATIONS }, 100);
                return;
            }
        }

        // Create intent for when notification is tapped
        Intent intent = new Intent(this, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent,
                PendingIntent.FLAG_IMMUTABLE);

        // Build the notification
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_dialog_map)
                .setContentTitle("Bienvenue sur Itinera! 🌍")
                .setContentText("Planifiez votre prochain voyage maintenant!")
                .setStyle(new NotificationCompat.BigTextStyle()
                        .bigText(
                                "Découvrez des destinations incroyables et planifiez votre voyage parfait avec Itinera. Famille, romantique, solo ou entre amis - nous avons tout prévu!"))
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setContentIntent(pendingIntent)
                .setAutoCancel(true)
                .setColor(Color.parseColor("#FF6B35"));

        // Show notification
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(this);
        try {
            notificationManager.notify(NOTIFICATION_ID, builder.build());
        } catch (SecurityException e) {
            // Permission not granted, ignore
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == 100 && grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            showWelcomeNotification();
        }
    }

    private void configureWebView() {
        WebSettings webSettings = webView.getSettings();

        // Enable JavaScript (required for most modern websites)
        webSettings.setJavaScriptEnabled(true);

        // Enable DOM storage (for localStorage, sessionStorage)
        webSettings.setDomStorageEnabled(true);

        // ===== VIEWPORT SETTINGS FOR PERFECT MOBILE ALIGNMENT =====

        // Use wide viewport to match website's viewport meta tag
        webSettings.setUseWideViewPort(true);

        // Scale content to fit the screen width
        webSettings.setLoadWithOverviewMode(true);

        // Set initial scale to 0 to respect the page's viewport meta
        webView.setInitialScale(0);

        // Disable zoom for cleaner mobile experience
        webSettings.setBuiltInZoomControls(false);
        webSettings.setDisplayZoomControls(false);
        webSettings.setSupportZoom(false);

        // Text size - use system default
        webSettings.setTextZoom(100);

        // ===== RENDERING SETTINGS =====

        // Enable hardware acceleration for smooth scrolling
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        // Remove scrollbars for cleaner look
        webView.setVerticalScrollBarEnabled(false);
        webView.setHorizontalScrollBarEnabled(false);

        // No overscroll effect
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);

        // Cache settings
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);

        // Allow mixed content (http in https)
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);

        // Database and app cache
        webSettings.setDatabaseEnabled(true);

        // Set user agent to indicate mobile app
        String userAgent = webSettings.getUserAgentString();
        webSettings.setUserAgentString(userAgent + " ItineraApp/1.0 Mobile");

        // Handle page loading within the WebView
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);

                // Inject CSS to ensure full width alignment
                String js = "javascript:(function() {" +
                        "var meta = document.querySelector('meta[name=viewport]');" +
                        "if (!meta) {" +
                        "  meta = document.createElement('meta');" +
                        "  meta.name = 'viewport';" +
                        "  document.head.appendChild(meta);" +
                        "}" +
                        "meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';" +
                        "})()";
                view.loadUrl(js);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });

        // Handle progress updates
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progressBar.setProgress(newProgress);
            }
        });
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            // Re-apply immersive mode when window gains focus
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
                getWindow().getDecorView().setSystemUiVisibility(
                        View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
                                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
                                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
                                View.SYSTEM_UI_FLAG_FULLSCREEN |
                                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
            }
        }
    }

    // Handle back button - go back in WebView history
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        webView.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        webView.onPause();
    }
}
