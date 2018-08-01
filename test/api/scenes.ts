import test from 'ava';
import { useSpectron } from '../helpers/spectron';
import { getClient } from '../helpers/api-client';
import { IScenesServiceApi } from '../../app/services/scenes/scenes-api';
import { sleep } from '../helpers/sleep';
import { SceneBuilder } from "../helpers/scene-builder";
const path = require('path');

useSpectron({ restartAppAfterEachTest: false });

test('SceneItem.addFile()', async t => {
  const dataDir = path.resolve(__dirname, '..', '..', '..', 'test', 'data', 'sources-files');

  const client = await getClient();
  const sceneBuilder = new SceneBuilder(client);
  const scenesService = client.getResource<IScenesServiceApi>('ScenesService');
  const scene = scenesService.activeScene;

  scene.clear();
  scene.addFile(dataDir);

  if(!sceneBuilder.isEqualTo(`
  sources-files
    html
      hello.html: browser_source
    images
      moon.png: image_source
      sun.png: image_source
    media
      alertbox.mp4: ffmpeg_source
      chatbox.mp4: ffmpeg_source
    text
      hello.txt: text_gdiplus
`)) {
  await sleep(9999999);
}

  t.true(sceneBuilder.isEqualTo(`
    sources-files
      html
        hello.html: browser_source
      images
        moon.png: image_source
        sun.png: image_source
      media
        alertbox.mp4: ffmpeg_source
        chatbox.mp4: ffmpeg_source
      text
        hello.txt: text_gdiplus
  `));


});