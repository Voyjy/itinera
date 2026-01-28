package com.itinera.app;

import android.app.Activity;
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

/**
 * MainActivity - WebView-based app that displays your website inside the app.
 * Optimized for perfect mobile display alignment.
 */
public class MainActivity extends Activity {

    // ========================================
    // CHANGE THIS URL TO YOUR DEPLOYED WEBSITE
    // ========================================
    private static final String WEBSITE_URL = "https://itinera-xi.vercel.app/";

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

        // Load the website
        webView.loadUrl(WEBSITE_URL);
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
