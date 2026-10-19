package mm.ceir.checker;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import org.mozilla.geckoview.GeckoRuntime;
import org.mozilla.geckoview.GeckoSession;
import org.mozilla.geckoview.GeckoView;

public class MainActivity extends Activity {
    private static final String OFFICIAL_URL = "https://ceir.gov.mm/";
    private static GeckoRuntime runtime;
    private GeckoSession session;

    @Override protected void onCreate(Bundle state) {
        super.onCreate(state);
        setContentView(R.layout.activity_main);
        GeckoView view = findViewById(R.id.geckoView);
        TextView address = findViewById(R.id.addressText);

        session = new GeckoSession();
        session.setContentDelegate(new GeckoSession.ContentDelegate() {});
        if (runtime == null) runtime = GeckoRuntime.create(this);

        runtime.getWebExtensionController().ensureBuiltIn(
                "resource://android/assets/ceir-checker/", "ceir-checker@local")
            .accept(extension -> runOnUiThread(() -> address.setText("ceir.gov.mm · CEIR Checker ready")),
                    error -> runOnUiThread(() -> address.setText("ceir.gov.mm · extension error")));

        session.open(runtime);
        view.setSession(session);
        session.loadUri(OFFICIAL_URL);

        Button back = findViewById(R.id.backButton);
        Button forward = findViewById(R.id.forwardButton);
        Button reload = findViewById(R.id.reloadButton);
        back.setOnClickListener(v -> session.goBack());
        forward.setOnClickListener(v -> session.goForward());
        reload.setOnClickListener(v -> session.reload());
    }

    @Override public void onBackPressed() {
        if (session != null) session.goBack(); else super.onBackPressed();
    }

    @Override protected void onDestroy() {
        if (session != null) session.close();
        super.onDestroy();
    }
}
