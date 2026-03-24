import { useEffect } from 'react';
import { Contact as ContactComponent } from '../components/Contact';

export function Contact() {
  useEffect(() => {
    // Load HubSpot v2 script and render forms
    function loadHs() {
      // @ts-ignore
      if (window.hbspt) {
        try {
          // Render form into any container that has our data attributes
          document.querySelectorAll('.hs-form-frame').forEach((container, i) => {
            const el = container as HTMLElement;
            const portalId = el.getAttribute('data-portal-id') || '145992374';
            const formId = el.getAttribute('data-form-id') || '8a91e9cb-3891-442c-a06a-38894e7eafdb';
            const region = el.getAttribute('data-region') || 'eu1';
            // Clear container before render to avoid duplicates
            el.innerHTML = '';
            // Ensure a unique id for the target selector
            if (!el.id) {
              el.id = `hs-form-${formId}-${i}`;
            }
            // @ts-ignore
            window.hbspt.forms.create({
              region,
              portalId,
              formId,
              target: `#${el.id}`,
              css:
                // Hide HubSpot branding/footer
                '.hubspot-link__container, .hs-branding, .hs-form-privacy-policy, .hs-form__branding, .hs_legal_links, .legal-consent-container, .hs-form__powered-by, .hs-form-powered-by, .powered-by { display:none !important; }'
                // Base and white background
                + 'html, body { background:#ffffff !important; }'
                + '.hs-form, .hs-form * { font-family: inherit !important; }'
                // Typography colors for light background
                + '.hs-form .hs-form-field label { color:#0f022d !important; font-weight:600 !important; margin-bottom:8px !important; }'
                + '.hs-form .hs-richtext, .hs-form legend, .hs-form .inputs-list label span { color:#0f022d !important; }'
                // Inputs styling - white background
                + '.hs-form .hs-form-field .hs-input, .hs-form input, .hs-form textarea, .hs-form select { width:100% !important; padding:12px 16px !important; color:#0f022d !important; background:#ffffff !important; border:1px solid rgba(16,3,48,0.15) !important; border-radius:16px !important; outline:none !important; }'
                + '.hs-form input::placeholder, .hs-form textarea::placeholder { color:#737373 !important; }'
                + '.hs-form .hs-form-field .hs-input:focus, .hs-form input:focus, .hs-form textarea:focus, .hs-form select:focus { border-color:rgba(16,3,48,0.35) !important; box-shadow:0 0 0 2px rgba(16,3,48,0.08) !important; }'
                + '.hs-form textarea { min-height: 120px !important; resize: vertical !important; }'
                // Errors
                + '.hs-form .hs-error-msgs, .hs-form .hs-error-msg { color:#dc2626 !important; font-size:13px !important; margin-top:6px !important; }'
                // Submit button gradient to match project
                + '.hs-form .hs-submit .hs-button{ width:100% !important; padding:12px 20px !important; border-radius:16px !important; font-weight:600 !important; font-size:16px !important; color:#fff !important; background-image:linear-gradient(90deg, var(--primary,#0f022d) 0%, var(--accent,#100330) 100%) !important; box-shadow:0 10px 25px -10px rgba(16,3,48,.5) !important; border:0 !important; transition: all .2s ease !important; }'
                + '.hs-form .hs-submit .hs-button:hover{ filter:brightness(1.05) !important; transform:translateY(-1px) !important; }',
              onFormReady($form: any) {
                try {
                  $form.find('.hubspot-link__container, .hs-branding, .hs-form-privacy-policy, .hs-form__branding, .hs_legal_links, .legal-consent-container').remove();
                  const btn = $form.find('input[type=submit], .hs-button');
                  btn.attr('value', btn.attr('value') || 'Send Message');
                  // Replace visible texts across the form
                  const message = 'Contact OMAH — We’d love to hear from you';
                  $form.find('label').each(function (this: any) {
                    try { (this as HTMLElement).textContent = message; } catch (_) {}
                  });
                  $form.find('legend, .hs-richtext, .hs-field-desc, .form-columns .hs-field-desc').each(function (this: any) {
                    try { (this as HTMLElement).textContent = message; } catch (_) {}
                  });
                  $form.find('input[type=\"text\"], input[type=\"email\"], input[type=\"tel\"], textarea, select').each(function (this: any) {
                    try { (this as HTMLInputElement).placeholder = message; } catch (_) {}
                  });
                } catch (_) {}
              },
            });
          });
        } catch (_) {}
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js-eu1.hsforms.net/forms/v2.js';
      script.async = true;
      script.onload = loadHs;
      document.head.appendChild(script);
    }

    loadHs();

    return () => {
      // Cleanup rendered iframes to prevent duplicates on re-mount
      document.querySelectorAll('.hs-form-iframe, iframe[src*="hubspot"]').forEach((n) => n.remove());
    };
  }, []);

  return (
    <div className="min-h-screen bg-background pt-20">
      <ContactComponent />
    </div>
  );
}
