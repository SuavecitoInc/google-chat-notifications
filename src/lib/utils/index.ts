import { NetlifyPayload } from '../types/netlify.js';

export * from './messages.js';

export function format(uptime: number) {
  function pad(s: number) {
    return (s < 10 ? '0' : '') + s;
  }
  const hours = Math.floor(uptime / (60 * 60));
  const minutes = Math.floor((uptime % (60 * 60)) / 60);
  const seconds = Math.floor(uptime % 60);

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function getSentryProjectFromUrl(url: string) {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 4];
}

export function jsonPrettyPrint(input: Object) {
  return JSON.stringify(input, null, '&nbsp;')
    .split('\n')
    .join('<br>&nbsp;&nbsp;')
    .split('<br>&nbsp;&nbsp;}')
    .join('<br>}');
}

export function buildNetlifyDeploymentUrl(payload: NetlifyPayload) {
  const { name, id } = payload;
  return `https://app.netlify.com/sites/${name}/deploys/${id}`;
}
