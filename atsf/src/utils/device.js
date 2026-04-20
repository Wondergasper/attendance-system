/**
 * Utility to generate and persist a unique device signature.
 * Uses a composite fingerprint based on multiple browser signals
 * for stronger device binding (not just Math.random).
 */
export const getDeviceFingerprint = () => {
    let deviceId = localStorage.getItem('ats_device_id');

    if (!deviceId) {
        // Composite fingerprint: screen + timezone + language + platform hash
        const components = [
            navigator.platform || 'unknown',
            navigator.language || 'unknown',
            String(screen.width) + 'x' + String(screen.height),
            String(new Date().getTimezoneOffset()),
            navigator.hardwareConcurrency || '0',
            navigator.userAgent.substring(0, 40),
        ].join('|');

        // Simple hash function (FNV-1a 32-bit)
        let hash = 2166136261;
        for (let i = 0; i < components.length; i++) {
            hash ^= components.charCodeAt(i);
            hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
            hash = hash >>> 0; // keep unsigned 32-bit
        }

        // Add a random salt to differentiate same-machine users
        const salt = Math.random().toString(36).substring(2, 8).toUpperCase();
        deviceId = `DEV-${hash.toString(16).toUpperCase()}-${salt}`;
        localStorage.setItem('ats_device_id', deviceId);
    }

    return deviceId;
};
