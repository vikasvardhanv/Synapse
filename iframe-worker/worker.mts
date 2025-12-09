// All Synapse projects created after May 1 2025 dynamically import this script when they
// receive a postMessage of type 'synapsePreviewRequest' in development.
import { toPng } from 'html-to-image';

export default async function (message: any) {
  // These checks should already have been made before loading this module.
  // Make them here again because they're really important.
  if (message.source !== window.parent) {
    return;
  }
  if (message.data.type !== 'synapsePreviewRequest') {
    return;
  }
  if (message.data.request === 'ping') {
    message.source.postMessage({ type: 'pong' }, message.origin);
  }
  if (message.data.request === 'screenshot') {
    const imageData = await toPng(document.body);
    message.source.postMessage({ type: 'screenshot', data: imageData }, message.origin);
  }
}
