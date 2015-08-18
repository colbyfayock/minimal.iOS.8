#Contributing to minimal.iOS.8

###Commits / Pull Requests

Please try to keep commits separate, clean, and organized on a new branch when making a pull request

##Bundle identifiers and icon file names

(lib/mios_icons.jsx)[lib/mios_icons.jsx] contains javascript that adds icon information as an object into an array that allows me to loop through dynamically compiling out icons at different sizes. This makes my life much easier and can concentrate more on the fun part (designing the icons). Making additions / edits to these objects are pretty simple... here are some examples:

### Adding a new icon
Let's say we have a new app called "Awesome App" which isn't currently supported by minimal.iOS.8 and we want to add it in. Open (lib/mios_icons.jsx)[lib/mios_icons.jsx], find where the icon info would fit *in alphabetical order*, and add in the new object. Example:

####Before
```
mios.icons.push({
    name: 'Aviary Photo Editor',
    bundle_id: 'com.aviary.Photo-Editor',
    app_id: 'Photo Editor.app',
    psd_id: 'aviary_photo_editor',
    icons: {
        appicon: true
    }
});

mios.icons.push({
    name: 'Badoo',
    bundle_id: 'com.badoo.Badoo',
    app_id: 'Badoo.app',
    psd_id: 'badoo',
    icons: {
        appicon: true,
        icon: true,
        custom: [
            [ 'Icon-120', 120 ]
        ]
    }
});
```

####After
```
mios.icons.push({
    name: 'Aviary Photo Editor',
    bundle_id: 'com.aviary.Photo-Editor',
    app_id: 'Photo Editor.app',
    psd_id: 'aviary_photo_editor',
    icons: {
        appicon: true
    }
});

mios.icons.push({
    name: 'Awesome App',
    bundle_id: 'com.awesome.app',
    app_id: 'Awesome.app',
    psd_id: 'awesome',
    icons: {
        appicon: true
    }
});

mios.icons.push({
    name: 'Badoo',
    bundle_id: 'com.badoo.Badoo',
    app_id: 'Badoo.app',
    psd_id: 'badoo',
    icons: {
        appicon: true,
        icon: true,
        custom: [
            [ 'Icon-120', 120 ]
        ]
    }
});
```

### Editing / fixing a Bundle Identifier
Now, a month after we added Awesome App, there was an update that changed the previous Bundle ID of *com.awesome.app* to *com.superawesome.app*. Look for the name "Awesome App" in mios_icons.jsx, find the line *bundle_id* and update the value as needed.

####Before
```
mios.icons.push({
    name: 'Awesome App',
    bundle_id: 'com.awesome.app',
    app_id: 'Awesome.app',
```

####After
```
mios.icons.push({
    name: 'Awesome App',
    bundle_id: 'com.superawesome.app',
    app_id: 'Awesome.app',
```
