/**
 * Private Content Decryption
 *
 * Handles password-based decryption for :::private directive content.
 */
(function() {
    function base64ToBuffer(base64) {
        return Uint8Array.from(atob(base64), function(c) { return c.charCodeAt(0); });
    }
    async function deriveKey(password, salt) {
        var encoder = new TextEncoder();
        var keyMaterial = await crypto.subtle.importKey(
            'raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']
        );
        return crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
            keyMaterial, { name: 'AES-CBC', length: 256 }, false, ['decrypt']
        );
    }
    async function decryptPrivate(payload, password) {
        var data = base64ToBuffer(payload);
        var salt = data.slice(0, 16);
        var iv = data.slice(16, 32);
        var ciphertext = data.slice(32);
        var key = await deriveKey(password, salt);
        var decrypted = await crypto.subtle.decrypt(
            { name: 'AES-CBC', iv: iv }, key, ciphertext
        );
        return new TextDecoder().decode(decrypted);
    }
    document.addEventListener('click', async function(e) {
        var toggle = e.target.closest('.md-private-toggle');
        if (toggle) {
            var container = toggle.closest('.md-directive-private');
            if (!container) return;
            var input = container.querySelector('.md-private-input');
            if (!input) return;
            var isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            toggle.classList.toggle('is-visible', input.type === 'text');
            return;
        }
        var btn = e.target.closest('.md-private-btn');
        if (btn) {
            var container = btn.closest('.md-directive-private');
            if (!container) return;
            var payload = container.dataset.payload;
            var input = container.querySelector('.md-private-input');
            var locked = container.querySelector('.md-private-locked');
            var unlocked = container.querySelector('.md-private-unlocked');
            var content = container.querySelector('.md-private-content');
            var error = container.querySelector('.md-private-error');
            if (!input || !payload) return;
            var password = input.value;
            if (!password) { input.focus(); return; }
            try {
                var html = await decryptPrivate(payload, password);
                content.innerHTML = html;
                locked.style.display = 'none';
                unlocked.style.display = 'block';
                error.style.display = 'none';
            } catch (err) {
                error.style.display = 'block';
                input.value = '';
                input.focus();
            }
            return;
        }
        var lockBtn = e.target.closest('.md-private-lock-btn');
        if (lockBtn) {
            var container = lockBtn.closest('.md-directive-private');
            if (!container) return;
            var locked = container.querySelector('.md-private-locked');
            var unlocked = container.querySelector('.md-private-unlocked');
            var content = container.querySelector('.md-private-content');
            var input = container.querySelector('.md-private-input');
            var error = container.querySelector('.md-private-error');
            if (content) content.innerHTML = '';
            if (unlocked) unlocked.style.display = 'none';
            if (locked) locked.style.display = 'flex';
            if (input) input.value = '';
            if (error) error.style.display = 'none';
            return;
        }
    });
    document.addEventListener('keydown', function(e) {
        if (e.key !== 'Enter') return;
        var input = e.target.closest('.md-private-input');
        if (!input) return;
        var container = input.closest('.md-directive-private');
        if (!container) return;
        var btn = container.querySelector('.md-private-btn');
        if (btn) btn.click();
    });
})();
