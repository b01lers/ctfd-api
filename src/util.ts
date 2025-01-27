export function extractNonce(raw: string) {
    return raw.match(/'csrfNonce': "(.+?)"/)![1];
}
