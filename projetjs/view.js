var view ={};
view.imageCroix = 'img/delete.png';
view.imageDisk  = 'img/disquette.png'
view.imageHorloge  = 'img/horloge.png'


/***********************************************************/
/*********************GETTERS ET SETTERS********************/
/***********************************************************/

view.getZoneSaisie  = function ()    { return $("#zone_saisie")          }
view.getTexteSaisie = function ()    { return this.getZoneSaisie().val() }
view.setTexteSaisie = function (txt) { view.getZoneSaisie().val(txt)     }

view.getResultat    = function () { return $("#resultats")}

view.getBoutonOk    = function () { return $("#bouton_ok")}

view.getBoutonDisque = function(){return $("#bouton_disque")}

view.getRechercheStocké = function () { return $("#recherches-stockees")}

view.getBoutonDeleteHistory = function () { return $("#delete_history")}

/***********************************************************/
/*******************AFFICHAGE LOADER************************/
/***********************************************************/

view.montrerLoader = function () { $("#wait").show() }
view.cacherLoader  = function () { $("#wait").hide() }


/***********************************************************/
/******************FONCTIONS DE SUPPRESSIONS****************/
/***********************************************************/

view.viderResultat        = function () { $("#resultats").empty()           }
view.viderRechercheStocké = function () { $("#recherches-stockees").empty() }
view.supprimerRecherche = function (e){ e.parent().remove() }



/***********************************************************/
/******************FONCTIONS DRAG AND DROP****************/
/***********************************************************/

view.placeSortable = function (callback) {

    $(view.getResultat()).sortable({
        cursor : 'move',
        stop: function(evt, ui) {
		setTimeout(
            // callback = model.updateSortable
            callback,
			200
		)
	    }
    });

    $( "#resultats" ).disableSelection();
}



/***********************************************************/
/******************FONCTIONS D'AFFICHAGE********************/
/***********************************************************/

view.afficherAnnonce = function (lesAnnonces,nomRecherche="",isSave=false) {
    // function afficherAnnonceCourante(lesAnnonces,isSave=false){

        if(isSave && lesAnnonces.length>0){
            //Si il y a des annonces sauvegardées
            $("#resultats").append("<p class='categorie_intermediare'>Vos annonces sauvegardées</p>");
        }else if (!isSave && lesAnnonces.length==0){
            //Si c'est une recherche qui n'a pas eu de résultat
            $("#resultats").append("<p class='categorie_intermediare'>Aucun résultat ne correspond à la recherche : "+nomRecherche +" !</p>");
        }else if( !isSave && lesAnnonces.length>0){
            //Si c'st un recherche qui aboutit
            $("#resultats").append("<p class='categorie_intermediare'>Résultat de la recherche : "+nomRecherche+"</p>");
        }


        for (let idAnnonce in lesAnnonces){
            var uneAnnonce =  lesAnnonces[idAnnonce];

            if(uneAnnonce!=null){

                var obj = $("<p/>",{class: "titre_result"})
                var titreSplit = uneAnnonce['titre'].split(' - ');
                if(titreSplit.length==3){
                    // Si exactement 3 chamsp dans le split l'annonce est de type EMPLOI - ENTREPRISE - LIEU
                    for (const unChamp of titreSplit) {
                        
                        obj.append($("<a/>",{
                            "class": " titre_news",
                            "href" : decodeEntities(uneAnnonce['url']),
                            "target": "_blank",
                            "text" : decodeEntities(unChamp)
                        }))
                    }
                }else{
                    obj.append($("<a/>",{
                        "class": " titre_news",
                        "href" : decodeEntities(uneAnnonce['url']),
                        "target": "_blank",
                        "text" : decodeEntities(uneAnnonce['titre'])
                    }))

                }
                    
            
                var date = new Date(uneAnnonce['date'])
                date = date.toLocaleDateString('fr-FR',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',hour:'numeric',minute:'numeric' })
                obj.append($("<span/>",{
                    "class": "date_news",
                    "text": date
                }))

                //si on est en mode chargment des img save :
                if(isSave){
                    obj.append($("<span/>",{
                        "class" : "action_news news_save",
                        "onclick" : "controller.supprimerAnnonce($(this))",
                        "html" : '	<img src="'+view.imageDisk+'"/>'
                    }))

                    //si non on as une nvll rechesse as afficher normalement
                }else{
                    obj.append($("<span/>",{
                        "class" : "action_news",
                        "onclick" : "controller.sauvegarderAnnonce($(this))",
                        "html" : '	<img src="'+view.imageHorloge+'"/>'
                    }))
                }

                obj.appendTo($("#resultats"));
                obj.data("object",uneAnnonce);
            }
        }


    }


view.afficherRecherche = function (listeRecherche) {
    view.viderRechercheStocké();
    for (let i = 0; i < listeRecherche.length; i++) {
        const texteDeLannonce = listeRecherche[i];
        var paragraphe = $("<p/>").addClass('titre-recherche');

        var label = $("<label/>",{
            "text" : texteDeLannonce,
            "onclick" : "controller.rechercher_nouvelles($(this).text())"
        })

        var img = $("<img/>",{
            "src" : this.imageCroix,
            "class" : "icone-croix",
            "onclick" : "controller.supprimerRecherche($(this))"

        });

        paragraphe.append(label).append(img);

     $("#recherches-stockees").append(paragraphe);
    }
}


view.saveAnnonce =function(e){
    $(e).attr("onclick","")
    $(e).children('img').attr('src', view.imageDisk);
    $(e).addClass('news_save')
}

view.supprimerAnnonce = function(e){

    $(e).attr("onclick","")
    $(e).children('img').attr('src', view.imageHorloge);
    $(e).removeClass("news_save");

}
