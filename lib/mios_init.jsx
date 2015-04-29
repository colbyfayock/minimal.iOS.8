try {
    mios.build( arguments );
    if ( errors = mios.getErrors() ) alert( errors );
} catch (e) {
    alert( 'Program error' );
}