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
                iconFolder;

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

                for ( var j = 0, iconSizesLen = iconSizes.length; j < iconSizesLen; j++ ) {

                    var iconFile,
                        iconFilePath = '';

                    iconFilePath += "/" + iconSizes[j][0] + ( iconSizes[j][2] && iconSizes[j][2] !== '' ? '' : ".png" );
                    app.activeDocument.resizeImage( iconSizes[j][1], iconSizes[j][1], undefined, ResampleMethod.BICUBICSHARPER);
                    iconFile = new File( decodeURI(bundleFolder) + iconFilePath );

                    if ( args[0] === 'compressed' ) {
                        this.save( iconFile, true );
                    } else {
                        this.save( iconFile, false );
                    }

                }

            }

            iconDoc.close( SaveOptions.DONOTSAVECHANGES );


        }

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

};