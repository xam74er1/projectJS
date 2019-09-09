// Création de l'objet
var model = {};
model.recherche_courante="";
model.recherche_courante_newsrecherches=[];
model.recherche_courante_news=[];
model.annonces_save=[]; // tableau d'annonces sauvegardées
model.listeAncienneRecherche =[]




/***********************************************************/
/******************GESTION DES ANNONCES*********************/
/***********************************************************/

/* Renvoi les annonces correspondant au texteSaisie et appel callback */
model.getAnnonce = function(texteSaisie,callback){
	model.addToAncienneRecherche(texteSaisie);
	$.get({
		url  : "search.php" ,
		data : {data : texteSaisie },
		dataType : 'json',
		success: function (lesAnnonces){
			console.log("Résultat de la recherche : ",texteSaisie,lesAnnonces);
			//si obj est deja present je le suprime de la liste avant de re afficher
			lesAnnonces.sort(function(a,b){new Date(b.date)-new Date(a.date)})
			model.setRechercheCouranteNews(lesAnnonces);
			model.filtrerLesAnnonceDejaSave();
			callback(texteSaisie);
		}
	})
}




model.filtrerLesAnnonceDejaSave = function(){

	var res = model.recherche_courante_news;

	for (var uneAnnonce of res) {
		//si une annonce est deja save
		if(uneAnnonce!=undefined&&uneAnnonce!=null){
			if(	indexOf(model.annonces_save,uneAnnonce)!=-1){
				res.splice(indexOf(res,uneAnnonce),1);
			}
	
		}
	}
	model.setRechercheCouranteNews(res)


}

/***********************************************************/
/******************GESTION DES RECHERCHES*******************/
/***********************************************************/

/* Ajoute @uneRecherche a model.recherche_save si uneRecherche n'est pas déjà dedans */
model.ajouterAuxRecherchesSave = function (uneRecherche){
	uneRecherche = $.trim(uneRecherche);
	if (model.recherches.indexOf(uneRecherche)==-1){		
		//si elle n'existe pas
		model.recherches.push(uneRecherche);
		model.saveRechercheToWebStorage();
	}
}
/* Renvoi les recherches_saves */
model.getRechercheSave = function (){
	return this.recherches;
}

/* Supprime l'élément @texte de recherche et sauvegarde dans le webStorage */
model.supprimerRecherche = function(texte){	
	model.recherches.splice(model.recherches.indexOf(texte),1);
	model.saveRechercheToWebStorage();
}


/***********************************************************/
/***********GESTION DES RECHERCHES COURANTES NEWS***********/
/***********************************************************/


/* Mets @lesAnnonces dans model.recherche_courantes_news */
model.setRechercheCouranteNews = function (lesAnnonces){
	this.recherche_courante_news = lesAnnonces;
}

/* Renvoi les recherche_courante_news */
model.getRechercheCouranteNews = function (){
	return this.recherche_courante_news;
}


/***********************************************************/
/*************GESTION DES ANCIENNES RECHERCHES**************/
/***********************************************************/

//Ajout de @texte à ancienne recherche
model.addToAncienneRecherche = function ( texte ){
	if( model.listeAncienneRecherche.indexOf(texte)== -1){
		model.listeAncienneRecherche.push(texte);
	}
	model.saveAncienneRechercheToWebStorage();
}

//Reset les anciennes recherches
model.resetAncienneRecherche = function(){
	model.listeAncienneRecherche = [];
	model.saveAncienneRechercheToWebStorage();
}
/***********************************************************/
/**********GESTION DES ANNONCES SAUVEGARDÉES NEWS***********/
/***********************************************************/


/* Renvoi les annonces_saves */
model.getAnnoncesSave = function(){
	return model.annonces_save;
}
/* Reset les annonces_saves */
model.resetAnnonceSave = function(){
	model.annonces_save=[];
}

model.addAnnonceSave = function (uneAnnonce) {
	/* Ajoute @uneAnnonce à annonce_save et sauvegarde dans le WebStorage */
	model.annonces_save.push(uneAnnonce);
	model.saveAnnonceToWebStorage();
}
/* Supprime l'élément @obj de annonces_saves et sauvegarde dans le WebStorage */
model.removeAnnonceSave=function (obj) {
	model.annonces_save.splice(model.annonces_save.indexOf(obj),1);
	model.saveAnnonceToWebStorage();
}







/***********************************************************/
/********************GESTION DU WEB STORAGE*****************/
/***********************************************************/

//Fonction mere du web Storage
model.saveToWebStorage = function (index) {
	localStorage.setItem(index,JSON.stringify(model[index]));
	console.log(model[index]," a été sauvegardé dans le WebStorage :",index);
}
model.loadFromWebStorage = function (index){
	model[index] = JSON.parse( localStorage.getItem(index));
	if(model[index]==null){
		model[index] = [];
	}
	console.log(index," a été recupéré du WebStorage :",model[index]);	
}


model.saveAnnonceToWebStorage = function (){
	model.saveToWebStorage("annonces_save");
}
model.loadAnnonceFromWebStorage = function(){
	model.loadFromWebStorage("annonces_save");
}

model.saveRechercheToWebStorage = function (){
	model.saveToWebStorage("recherches");
}

model.loadRecherchesFromWebStorage = function(){
	model.loadFromWebStorage("recherches");
}

model.loadAncienneRechercheFromWebStorage = function(){
	model.loadFromWebStorage("listeAncienneRecherche");
}

model.saveAncienneRechercheToWebStorage = function (){
	model.saveToWebStorage("listeAncienneRecherche");
}


/* Charges toutes les variables sauvegardé dans le web storage */
model.loadAllVarFromWebStorage = function(){
	model.loadAncienneRechercheFromWebStorage();
	model.loadAnnonceFromWebStorage();
	model.loadRecherchesFromWebStorage();
}


/* Rends les elements .news_save sortable */
model.updateSortable = function(){
	model.resetAnnonceSave();
	$(".news_save").each(function(index, el) {
		model.addAnnonceSave($(el).parent().data('object'));
	});
	
	model.saveAnnonceToWebStorage();
}

/* Renvoi la listeAncienneRecherche */
model.getAncienneRecherche = function (param) {  return model.listeAncienneRecherche}


