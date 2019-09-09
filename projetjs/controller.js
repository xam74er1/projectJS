
var controller = {};
$(document).ready(function() { controller.init() })
controller.init = function(){
    this.afficherDepart();
    this.initListener();
}



/***********************************************************/
/******************GESTIONS DES LISTENERS*******************/
/***********************************************************/
controller.initListener = function(){

    //Listener qui se declenche a chaque pression
    view.getZoneSaisie().on("keyup",function(e){
        if( e.which == 13 && this.value!=""){
            //si pression sur entrée et champs texte non vide
            console.log("Pression sur Entrée : ", view.getTexteSaisie());
            controller.rechercher_nouvelles();
        }
    })

    //Mise en place de l'autocompletion
    controller.updateAutocomplete();

    // Listener sur le bouton OK
    view.getBoutonOk().on("click",function(){
        console.log("Pression sur OK : ", view.getTexteSaisie());
        controller.rechercher_nouvelles()
    });


    view.getBoutonDisque().click(function(){
        model.ajouterAuxRecherchesSave(view.getTexteSaisie());
        view.afficherRecherche(model.getRechercheSave());
    });

    //Ajoute de la possiblite de triee
    view.placeSortable(model.updateSortable);
    //Effet sur le input
    $( document ).tooltip();

    view.getBoutonDeleteHistory().click(function(){
        model.resetAncienneRecherche();
        controller.updateAutocomplete();
    })


}

controller.updateAutocomplete = function(){
    view.getZoneSaisie().autocomplete({
        source: model.getAncienneRecherche()
    });

}


/***********************************************************/
/******************FONCTION DE RECHERCHE********************/
/***********************************************************/
controller.rechercher_nouvelles = function (texte = view.getTexteSaisie()) {
    view.viderResultat();
    view.montrerLoader();
    view.setTexteSaisie(texte);
    view.afficherAnnonce(model.getAnnoncesSave(),texte,true);
    controller.updateAutocomplete();

    var local_split = texte.split('\,');
    for (const annonce of local_split) {
        model.getAnnonce(annonce,controller.afficherAnnonce)
    }



}

controller.supprimerRecherche = function (e){
    model.supprimerRecherche(e.parent().text())
    view.supprimerRecherche(e);

}
/***********************************************************/
/******************GESTIONS D'AFFICHAGE*********************/
/***********************************************************/

controller.afficherAnnonce = function (nomRecherche) {
    view.cacherLoader();
    view.afficherAnnonce(model.getRechercheCouranteNews(),nomRecherche);

}

controller.afficherDepart = function(){
    //Charge toute les variables du webStorage
    model.loadAllVarFromWebStorage();
    view.afficherRecherche(model.getRechercheSave())
    view.afficherAnnonce(model.getAnnoncesSave(),"",true);
}




/***********************************************************/
/******************GESTIONS DES ANNONCES********************/
/***********************************************************/

controller.sauvegarderAnnonce = function (e) {

    var obj = $(e).parent().data('object');
    model.addAnnonceSave(obj);
    view.saveAnnonce(e);
    $(e).unbind();
    $(e).click(function(){
        controller.supprimerAnnonce($(this));
    });

}

controller.supprimerAnnonce = function(e){


	var obj = $(e).parent().data('object');

    model.removeAnnonceSave(obj);
    view.supprimerAnnonce(e);
    $(e).unbind();
    $(e).click(function(){
        controller.sauvegarderAnnonce(this);
    });
}
