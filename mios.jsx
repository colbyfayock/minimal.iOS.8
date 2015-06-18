var mios = {

    icons: false,

    getIcons: function() {

        return this.icons;

    },

    sizes: false,

    getSizes: function( type ) {

        return this.sizes[type];

    },

    sortSizes: function( sizes ) {

        var sizesObj = [];

        for ( var i = 0; i < sizes.length; i++ ) {

            for ( var j = 0; j < sizes[i].length; j++ ) {
                sizesObj.push( sizes[i][j] );
            }

        }

        sizesObj.sort(function(a, b) {
            return b[1] - a[1];
        });

        return sizesObj;

    },

    docValidate: function( doc, name ) {

        var appWidth = doc.width,
            appHeight = doc.height;


        if ( appWidth !== appHeight ) {
            if ( !this.errors ) this.errors = [];
            this.errors.push( name + ' - not square\r');
            return false;
        }

        if ( appWidth < 512 ) {
            if ( !this.errors ) this.errors = [];
            this.errors.push( name + ' - smaller than 512px\r');
            return false;
        }

        return true;

    },

    compress: function( file ) {

        if ( activeDocument.mode == DocumentMode.INDEXEDCOLOR ) {
            activeDocument.changeMode( ChangeMode.RGB );
        }

        var tinypng = new ActionDescriptor();
        tinypng.putPath(charIDToTypeID("In  "), file);

        var compress = new ActionDescriptor();
        compress.putObject(charIDToTypeID("Usng"), charIDToTypeID("tinY"), tinypng);
        executeAction(charIDToTypeID("Expr"), compress, DialogModes.NO);

    },

    save: function( file, compress ) {

        if ( !compress ) {

            var opts = new PNGSaveOptions();
            opts.interlaced = true;

            activeDocument.saveAs( file, opts );

        } else {

            var tinypng,
                compressImage;

            if ( activeDocument.mode == DocumentMode.INDEXEDCOLOR ) {
                activeDocument.changeMode( ChangeMode.RGB );
            }

            tinypng = new ActionDescriptor();
            tinypng.putPath(charIDToTypeID("In  "), file);

            compressImage = new ActionDescriptor();
            compressImage.putObject(charIDToTypeID("Usng"), charIDToTypeID("tinY"), tinypng);

            executeAction(charIDToTypeID("Expr"), compressImage, DialogModes.NO);

        }


    },

    build: function( args ) {

        var dirIcons = new Folder( (new File($.fileName)).parent + "/assets/icons/" ),
            iconList = this.getIcons();

        for ( var i = 0, iconsLen = iconList.length; i < iconsLen; i++ ) {

            var iconSizes = [],
                iconObj = iconList[i],
                iconDir,
                iconDoc,
                bundleFolder,
                iconFolder,
                selection;

            if ( !iconObj.psd_id ) continue;

            if ( iconDir = dirIcons.getFiles(iconObj.psd_id + '.psd')[0] ) {
                iconDoc = open( iconDir );
                iconDoc.flatten();
            } else {
                if ( !this.errors ) this.errors = [];
                this.errors.push( iconObj.name + ' - PSD does not exist\r');
                continue;
            }

            if ( !this.docValidate( iconDoc, iconObj.name ) ) {
                iconDoc.close( SaveOptions.DONOTSAVECHANGES );
                continue;
            }

            if ( args.length > 0 && args[0] === 'test' ) {
                iconDoc.close( SaveOptions.DONOTSAVECHANGES );
                continue;
            }

            if ( iconObj.icons ) {

                iconFolder = iconObj.icons.folder && iconObj.icons.folder !== '' ? iconObj.icons.folder : false;

                bundleFolder = new Folder( (new File($.fileName)).parent + "/dist/mios/Bundles/" + iconObj.bundle_id + ( iconFolder ? iconFolder : '' ) );
                if ( !bundleFolder.exists ) bundleFolder.create();

                if ( iconObj.icons.appicon ) iconSizes.push( this.getSizes('appicon') );
                if ( iconObj.icons.icon ) iconSizes.push( this.getSizes('icon') );
                if ( iconObj.icons.custom ) iconSizes.push( iconObj.icons.custom );

                iconSizes = this.sortSizes( iconSizes );

            }

            if ( iconSizes && iconSizes.length > 0 ) {

                if ( iconObj.mask && iconObj.mask !== '' ) {

                    iconDoc.artLayers.getByName('Background').isBackgroundLayer = false;

                    this.drawMask( this.getMaskPoints() );
                    selection = app.activeDocument.selection;
                    selection.invert();
                    selection.clear();
                    selection.deselect();

                }

                for ( var j = 0, iconSizesLen = iconSizes.length; j < iconSizesLen; j++ ) {

                    var iconFile,
                        iconFilePath = '';

                    iconFilePath += "/" + iconSizes[j][0] + ( iconSizes[j][2] && iconSizes[j][2] !== '' ? '' : ".png" );
                    app.activeDocument.resizeImage( iconSizes[j][1], iconSizes[j][1], undefined, ResampleMethod.BICUBICSHARPER);
                    iconFile = new File( decodeURI(bundleFolder) + iconFilePath );

                    if ( args.length > 0 && args[0] === 'compressed' ) {
                        this.save( iconFile, true );
                    } else {
                        this.save( iconFile, false );
                    }

                }

            }

            iconDoc.close( SaveOptions.DONOTSAVECHANGES );


        }

    },

    getMaskPoints: function() {

        var width = parseInt( app.activeDocument.width, 10 ),
            height = parseInt( app.activeDocument.height, 10 ),
            middle = width / 2,
            points = [];

        points[0] = [
            [ middle, 0 ],
            [ width * 0.91796875, 0 ],
            [ width * 0.08203125, 0 ]
        ];

        points[1] = [
            [ width, middle ],
            [ width, height * 0.91796875 ],
            [ width, height * 0.08203125 ]
        ];

        points[2] = [
            [ middle, height ],
            [ width * 0.08203125, height ],
            [ width * 0.91796875, height ]
        ];

        points[3] = [
            [ 0, middle ],
            [ 0, height * 0.08203125 ],
            [ 0, height * 0.91796875 ]
        ];

        return points;

    },

    drawMask: function( points ) {

        var doc = app.activeDocument,
            lineArray = [],
            pathItem,
            makePathPoint,
            drawShape;

        makePathPoint = function( xy ) {
            var pathPoint = new PathPointInfo;
            pathPoint.kind = PointKind.CORNERPOINT;
            pathPoint.anchor = xy[0];
            pathPoint.leftDirection = xy[1];
            pathPoint.rightDirection = xy[2];
            return pathPoint;
        };

        makeSubPath = function( points ) {
            var subPath = new SubPathInfo();
            subPath.closed = true;
            subPath.operation = ShapeOperation.SHAPEADD;
            subPath.entireSubPath = points;
            return subPath;
        };

        for ( var i = 0, pointsLen = points.length; i < pointsLen; i++ ) {
            lineArray.push( makePathPoint( points[i] ) );
        }

        pathItem = doc.pathItems.add("myPath", [ makeSubPath( lineArray ) ]);

        pathItem.makeSelection();
        pathItem.remove();

    },

    errors: false,

    parseErrors: function( errors ) {

        var errorLen = this.errors.length,
            errorMsg = 'Errors:\r';

        if ( errorLen < 1 ) return false;

        for ( var b = 0; b < errorLen; b++ ) {
            errorMsg += this.errors[b];
        }

        return errorMsg;

    },

    getErrors: function() {

        return this.parseErrors( this.errors );

    }

};;mios.icons = [];


mios.icons.push({
    name: 'Google Photos',
    bundle_id: 'com.google.photos',
    app_id: 'GooglePhotos.app',
    psd_id: 'google_photos',
    icons: {
        custom: [
            [ 'PhotosAppIcon29x29@2x', 58 ],
            [ 'PhotosAppIcon29x29@2x~ipad', 58 ],
            [ 'PhotosAppIcon29x29@3x', 87 ],
            [ 'PhotosAppIcon29x29~ipad', 29 ],
            [ 'PhotosAppIcon40x40@2x', 80 ],
            [ 'PhotosAppIcon40x40@2x~ipad', 80 ],
            [ 'PhotosAppIcon40x40@3x', 120 ],
            [ 'PhotosAppIcon40x40~ipad', 40 ],
            [ 'PhotosAppIcon60x60@2x', 120 ],
            [ 'PhotosAppIcon60x60@3x', 180 ],
            [ 'PhotosAppIcon76x76@2x~ipad', 152 ],
            [ 'PhotosAppIcon76x76~ipad', 76 ]
        ]
    }
});
;mios.sizes = {

    appicon: [

        [ 'AppIcon29x29',          29 ],
        [ 'AppIcon29x29~ipad',     29 ],
        [ 'AppIcon29x29@2x',       58 ],
        [ 'AppIcon29x29@2x~ipad',  58 ],
        [ 'AppIcon29x29@3x',       87 ],
        [ 'AppIcon29x29@3x~ipad',  87 ],

        [ 'AppIcon40x40',          40 ],
        [ 'AppIcon40x40~ipad',     40 ],
        [ 'AppIcon40x40@2x',       80 ],
        [ 'AppIcon40x40@2x~ipad',  80 ],
        [ 'AppIcon40x40@3x',       120 ],
        [ 'AppIcon40x40@3x~ipad',  120 ],

        [ 'AppIcon50x50',          50 ],
        [ 'AppIcon50x50@2x',       100 ],

        [ 'AppIcon57x57',          57 ],
        [ 'AppIcon57x57@2x',       114 ],

        [ 'AppIcon60x60',          60 ],
        [ 'AppIcon60x60@2x',       120 ],
        [ 'AppIcon60x60@3x',       180 ],

        [ 'AppIcon72x72',          72 ],
        [ 'AppIcon72x72~ipad',     72 ],
        [ 'AppIcon72x72@2x',       144 ],
        [ 'AppIcon72x72@2x~ipad',  144 ],

        [ 'AppIcon76x76',          76 ],
        [ 'AppIcon76x76~ipad',     76 ],
        [ 'AppIcon76x76@2x',       152 ],
        [ 'AppIcon76x76@2x~ipad',  152 ],

        [ 'AppIcon120x120',        120 ]

    ],

    icon: [

        [ 'Icon',              60 ],
        [ 'Icon@2x',           120 ],
        [ 'Icon@3x',           180 ],

        [ 'Icon-40',           40 ],
        [ 'Icon-40@2x',        80 ],
        [ 'Icon-40@3x',        180 ],

        [ 'Icon-60',           60 ],
        [ 'Icon-60@2x',        120 ],
        [ 'Icon-60@3x',        180 ],

        [ 'Icon-72',           72 ],
        [ 'Icon-72@2x',        144 ],
        [ 'Icon-72@3x',        216 ],

        [ 'Icon-76',           76 ],
        [ 'Icon-76@2x',        152 ],
        [ 'Icon-76@3x',        228 ],

        [ 'Icon-Small-40',     40 ],
        [ 'Icon-Small-40@2x',  80 ],
        [ 'Icon-Small-40@3x',  120 ],

        [ 'Icon-Small-50',     50 ],
        [ 'Icon-Small-50@2x',  100 ],
        [ 'Icon-Small-50@3x',  150 ],

        [ 'Icon-Small',        29 ],
        [ 'Icon-Small@2x',     58 ],
        [ 'Icon-Small@3x',     87 ]

    ]

};;try {
    mios.build( arguments );
    if ( errors = mios.getErrors() ) alert( errors );
} catch (e) {
    alert( 'Program error' );
}