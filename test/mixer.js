 import test from 'ava';
import { useSpectron, focusMain } from './helpers/spectron/index';
import { addSource, selectSource, clickRemoveSource, addExistingSource} from './helpers/spectron/sources';
import { addScene } from './helpers/spectron/scenes';

useSpectron();


test('Adding and removing a AudioSource', async t => {
  const app = t.context.app;

  await addSource(t, 'Media Source', 'Source With Audio');
  await addSource(t, 'Color Source', 'Source Without Audio');
  await focusMain(t);


  t.true(await app.client.$('.mixer-panel').waitForExist('div=Source With Audio', 10 * 10000));
  t.false(await app.client.$('.mixer-panel').waitForExist('div=Source Without Audio', 10 * 10000));


  await selectSource(t, 'Source With Audio');
  await clickRemoveSource(t);

  t.false(await app.client.$('.mixer-panel').waitForExist('div=Source With Audio', 10 * 10000));
});


test('Nested scenes should provide audio sources to mixer', async t => {
  const app = t.context.app;

  await addSource(t, 'Media Source', 'Nested Media Source');
  await focusMain(t);

  await addScene(t, 'New Scene');
  await addSource(t, 'Media Source', 'Simple Media Source');
  await addExistingSource(t, 'Scene', 'Scene');

  await focusMain(t);
  t.true(await app.client.$('.mixer-panel').waitForExist('div=Simple Media Source', 10 * 10000));
  t.true(await app.client.$('.mixer-panel').waitForExist('div=Nested Media Source', 10 * 10000));

});
