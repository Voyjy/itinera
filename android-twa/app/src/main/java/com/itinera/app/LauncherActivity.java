package com.itinera.app;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

/**
 * LauncherActivity - Opens the website in the default browser.
 * 
 * This is a simplified launcher that works on any Android device.
 * It simply opens the URL in whatever browser is available.
 */
public class LauncherActivity extends Activity {

    // URL to load - change this to your deployed website
    private static final String WEBSITE_URL = "https://parallax-medieval.netlify.app/";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        try {
            // Open the website in the default browser
            Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(WEBSITE_URL));
            browserIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(browserIntent);
        } catch (Exception e) {
            // If that fails, try without the flag
            try {
                Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(WEBSITE_URL));
                startActivity(browserIntent);
            } catch (Exception e2) {
                // Do nothing - just close
            }
        }

        // Close this activity
        finish();
    }
}
