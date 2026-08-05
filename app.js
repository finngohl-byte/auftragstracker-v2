const name = document.getElementById("name-input");
const adress = document.getElementById("adress_input");
const content = document.getElementById("info-input");
const button = document.getElementById("hinzufuegen");
const overview = document.getElementById("Uebersicht");
const bestaetigung = document.getElementById("deleteModal")
const confirmButton = document.getElementById("confirmDelete");
const cancelButton = document.getElementById("cancelDelete");
const bearbeitung = document.getElementById("Nachbearbeitung")
const name_change = document.getElementById("name-change");
const adress_change = document.getElementById("adress_change");
const content_change = document.getElementById("info-change");
const edit_button = document.getElementById("edit");
const return_button = document.getElementById("return")
const geraetename = geraetename_holen();

let filter = "alle"
let loeschID = null;
let bearbeitugsID = null;

const all = document.createElement("button")
all.textContent = "Alle"
all.addEventListener("click", function(){
        filter = "alle"
        render_list()
})
const undone = document.createElement("button")
undone.textContent = "OFFENE"
undone.addEventListener("click", function(){
    filter = "OFFEN"
    render_list()
})
const done_ = document.createElement("button")
done_.textContent = "ERLEDIGTE"
done_.addEventListener("click", function(){
    filter = "ERLEDIGT"
    render_list()

})
const categories = document.createElement("div")
categories.append(all, undone, done_)
categories.classList.add("change_btn")
overview.parentNode.insertBefore(categories, overview)




confirmButton.addEventListener("click", function(){
        auftrag_loeschen(loeschID);
        bestaetigung.style.display = "none"
    })

cancelButton.addEventListener("click", function(){
        bestaetigung.style.display = "none"  
    })

edit_button.addEventListener("click", function(){
    auftrag_aktualisieren(bearbeitugsID, {name: name_change.value, adresse: adress_change.value, content: content_change.value })

    bearbeitung.style.display = "none"; 
})

return_button .addEventListener("click", function(){
    bearbeitung.style.display = "none";

})










function render_list(){
    overview.innerHTML = ""
    if (window.auftraege.length > 0){
        categories.style.display = "flex";    
    } else {
        categories.style.display = "none";     
        }
        
    all.classList.remove("aktiv");
    undone.classList.remove("aktiv");
    done_.classList.remove("aktiv");

    if (filter === "alle"){
        all.classList.add("aktiv");
    } else if (filter === "OFFEN"){
        undone.classList.add("aktiv");
    } else if (filter === "ERLEDIGT"){
        done_.classList.add("aktiv");
    }
    let anzuzeigen = window.auftraege

    if (filter === "OFFEN"){
        anzuzeigen = window.auftraege.filter(function(a){return !a.erledigt})
 
    } else if (filter === "ERLEDIGT") {
        anzuzeigen = window.auftraege.filter(function(a){return a.erledigt})
    } 

    for (const auftrag of anzuzeigen){
        const li = document.createElement("li")
        const done = document.createElement("button")
        const remove = document.createElement("button")
        const bearbeitet = document.createElement("button")
        const edit = document.createElement("button")
        const buttons =  document.createElement("div")
        

        li.classList.add("liste")
        buttons.classList.add("change_btn")

        li.textContent  = auftrag.name + " - " + auftrag.adresse + " - " + auftrag.content

        if (auftrag.erledigt && auftrag.erledigt_von){
            li.textContent += " (erledigt von " + auftrag.erledigt_von + ")";
        } else if (auftrag.bearbeitet && auftrag.bearbeitet_von){
            li.textContent += " (in Bearbeitung von " + auftrag.bearbeitet_von + ")";
        }


        bearbeitet.textContent = "IN BEARBEITUNG"
        bearbeitet.addEventListener("click", function(){
            auftrag_aktualisieren(auftrag.firestoreId, {bearbeitet: true, erledigt: false, bearbeitet_von: geraetename});
        })    
        buttons.appendChild(bearbeitet)

        done.textContent = "DONE"
        done.addEventListener("click", function(){
            auftrag_aktualisieren(auftrag.firestoreId, {erledigt: true, bearbeitet: false, erledigt_von: geraetename});
        })
        buttons.appendChild(done)

        
        remove.textContent =  "DELETE"  
        remove.addEventListener("click", function(){
            bestaetigung.style.display = "flex"

            loeschID = auftrag.firestoreId
        })    
        buttons.appendChild(remove)   


        edit.textContent = "EDIT"
        edit.addEventListener("click", function(){
            bearbeitugsID = auftrag.firestoreId
            bearbeitung.style.display = "flex";
            name_change.value = auftrag.name 
            adress_change.value = auftrag.adresse
            content_change.value = auftrag.content
            
        })
        buttons.appendChild(edit)
  
   
        if (auftrag.erledigt){
            li.classList.add("erledigt")

        } 

        if (auftrag.bearbeitet){
            li.classList.add("bearbeitung")

        }

        li.appendChild(buttons)
        overview.appendChild(li)
        
    }

}
window.render_list = render_list;

function geraetename_holen(){
    let gespeicherterName = localStorage.getItem("geraetename");
    if (!gespeicherterName){
        gespeicherterName = prompt("Wie heißt du?");
        localStorage.setItem("geraetename", gespeicherterName);
    }
    return gespeicherterName;
}


button.addEventListener("click", function(){
    const name_text = name.value;
    const adress_text = adress.value;
    const content_text = content.value;

    const data = [name_text, adress_text, content_text];

    for (const item of data){
        if (item === ""){
            console.log("Not all slots were filled");
            return;  
        }  
    }

    auftrag_hinzufuegen(name_text, adress_text, content_text)


    name.value = "";
    adress.value = "";
    content.value = "";
});

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")

}