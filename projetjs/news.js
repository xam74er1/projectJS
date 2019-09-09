//ce si est un test
var recherches=[];//tableau contenant des chaines de caracteres correspondant aux recherches stockees
var recherche_courante;// chaine de caracteres correspondant a la recherche courante
var recherche_courante_news=[]; // tableau d'objets de type resultats (avec titre, date et url)
var annonces_save=[];
var listAncinneRechersse =[] // tableau d'annonces sauvegardées

function init()
{
	//ajout listener
	addListenerChampRecherche();

	//recuperation des cookie

	//reucuperation des rechsse savegarde
	var cookieSauvegarde = localStorage.getItem('rechercheSauvegarde');

	if(cookieSauvegarde != undefined){
		recherches = JSON.parse(cookieSauvegarde);
	}
	//AAffichage recherche sauvegarder
	for (rec of recherches) {
		if(rec!=null){
			addHtmlRechersse(rec);
		}

	}

	//recuperation des rechsse effectuer
//ok impleten
	var cookie_annonces_save = localStorage.getItem('annonces_save');

	if(cookie_annonces_save!=undefined){
		annonces_save= JSON.parse(cookie_annonces_save);
	}

	//affiche annonces sauvegardé
	afficherAnnonceCourante(annonces_save,true);

//ok impletne
	listAncinneRechersse = JSON.parse( localStorage.getItem("listAncinneRechersse"));

	if(listAncinneRechersse==null){
		listAncinneRechersse = [];
	}



	$( "#zone_saisie" ).autocomplete({
		source: listAncinneRechersse
	});

	//pour ordone

	$( "#resultats" ).sortable({stop: function(evt, ui) {
		setTimeout(
			function(){
				//	console.log($("#resultats").children());
				annonces_save = [];
				$(".news_save").each(function(index, el) {

					//console.log($(el).parent().data('object'));
					annonces_save.push($(el).parent().data('object'));

				});

				sauvegarderLocalStorage();
			},
			200
		)
	}
});
$( "#resultats" ).disableSelection();

}









//------------------------------------------
function ajouter_recherche(){
	//	console.log("hello ");
	var txt = $.trim($("#zone_saisie").val());

	//Si la rechsse as pas ete effectuer

	if(recherches.indexOf(txt)==-1){
		recherches.push(txt);
		addHtmlRechersse(txt);

		//save ds un cookie
		//$.cookie("rechercheSauvegarde",JSON.stringify(recherches),{ expires: 1000 });
		localStorage.setItem("rechercheSauvegarde",JSON.stringify(recherches));
	}


}//fini

function addHtmlRechersse(txt) {
	var paragraphe = $("<p/>").addClass('titre-recherche');
	var label = $("<label/>").text(txt);
	var img = $("<img/>").attr('src', 'croix30.jpg').addClass('icone-croix');
	img.click(function(){
		supprimer_recherche($(this));
	});


	label.click(function(){
		//	console.log("clique label ");
		selectionner_recherche(this);
	});

	paragraphe.append(label).append(img);

	$("#recherches-stockees").append(paragraphe);
}///fini


function test() {
	console.log("test");
}

function supprimer_recherche(e)
{
	console.log("suprimer rechersse");
	var txt = e.parent().text();
	recherches.splice(recherches.indexOf(txt),1);
	e.parent().remove();

	//$.cookie("rechercheSauvegarde",JSON.stringify(recherches),{ expires: 1000 });
	localStorage.setItem("rechercheSauvegarde",JSON.stringify(recherches));

}//fini


function selectionner_recherche(e)
{
	$("#zone_saisie").val($(e).text());

	recherche_courante=$(e).text();
	rechercher_nouvelles();

}//fini



function addListenerChampRecherche(){

	$("#zone_saisie").on("keyup",function(e){
		if( e.which == 13 && this.val!=""){
			rechercher_nouvelles();
		}
	})
}


function rechercher_nouvelles()
{

	$("#resultats").empty();
	afficherAnnonceCourante(annonces_save,true);
	montrerLoader();
	recherche_courante = $("#zone_saisie").val();


	$.get({
		url  : "search.php" ,
		data : {data : $("#zone_saisie").val() },
		dataType : 'json',
		success: function (lesAnnonces,textStatus,xhr){
			//si obj est deja present je le suprime de la liste avant de re afficher
			maj_resultats(lesAnnonces);
			recherche_courante_news = lesAnnonces;
			cacherLoader();
			afficherAnnonceCourante(lesAnnonces);
		}

	})

	//pour auto completion

	listAncinneRechersse.push(recherche_courante);
	localStorage.setItem("listAncinneRechersse",JSON.stringify(listAncinneRechersse));
}//fini

function montrerLoader(){
	$("#wait").show();
}//fini

function cacherLoader(){
	$("#wait").hide();

}//fini

function maj_resultats(res)
{

	for (var anonce of res) {
		//si une annonce est deja save
		console.log(anonce);
		if(	indexOf(annonces_save,anonce)!=-1){
			res.splice(indexOf(res,anonce),1);
		}
	}


}


function sauver_nouvelle(e)
{
	console.log("sauvegarde de la nouvelle");

	console.log(e);
	$(e).children('img').attr('src', 'disk15.jpg');
	$(e).children('img').addClass('news_save')
	$(e).unbind();
	$(e).click(function(){
		console.log("this",this);
		console.log("$(this)",$(this))
		supprimer_nouvelle($(this));
	});

	var obj = $(e).parent().data('object');
	annonces_save.push(obj);
	//	console.log(recherche_courante_news);
	//$.cookie("annonces_save",JSON.stringify(annonces_save),{ expires: 1000 });
	sauvegarderLocalStorage();
}

function sauvegarderLocalStorage() {
	localStorage.setItem("annonces_save",JSON.stringify(annonces_save));
}

function supprimer_nouvelle(e)
{

	console.log("suprimer nvll ");
	$(e).children('img').attr('src', 'horloge15.jpg');

	var obj = $(e).parent().data('object');

	annonces_save.splice(recherches.indexOf(obj),1);
	$(e).unbind();
	$(e).click(function(){
		sauver_nouvelle(this);
	});
	$(e).removeClass('news_save')
	//$.cookie("annonces_save",JSON.stringify(annonces_save),{ expires: 1000 });
	localStorage.setItem("annonces_save",JSON.stringify(annonces_save));

}


function afficherAnnonceCourante(lesAnnonces,isSave=false){
	console.log(lesAnnonces);
	if (lesAnnonces.length == 0 && !isSave){
		$("#resultats").text("Aucun résultat ne correspond à la recherche : "+recherche_courante+" !");
	}else{
		for (let idAnnonce in lesAnnonces){
			var uneAnnonce =  lesAnnonces[idAnnonce];
			if(typeof uneAnnonce !== 'undefined'&&uneAnnonce!=null){
				var obj = $("<p/>",{
					class: "titre_result"
				})
				obj.append($("<a/>",{
					"class": " titre_news",
					"href" : decodeEntities(uneAnnonce['url']),
					"target": "_blank",
					"text" : uneAnnonce['titre']
				}))

				obj.append($("<span/>",{
					"class": "date_news",
					"text": uneAnnonce['date']
				}))

				//si on est en mode chargment des img save :
				if(isSave){
					obj.append($("<span/>",{
						"class" : "action_news news_save",
						"click" : function(){supprimer_nouvelle($(this))},
						"html" : "	<img src=\"disk15.jpg\"/>"
					}))

					//si non on as une nvll rechesse as afficher normalement
				}else{
					obj.append($("<span/>",{
						"class" : "action_news",
						"click" : function(){sauver_nouvelle($(this))},
						"html" : "	<img src=\"horloge15.jpg\"/>"
					}))
				}

				obj.appendTo($("#resultats"));
				obj.data("object",uneAnnonce);
			}
		}

	}
	console.log("fin");
}



/* <p class="titre_result">
<a class="titre_news" href="url " target="_blank">titre</a>
<span class="date_news">date</span>
<span class="action_news" onclick="sauver_nouvelle(this)">
< img src="horloge15.jpg"/>
</span>
</p> */
