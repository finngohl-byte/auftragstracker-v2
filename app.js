const name = document.getElementById("name-input");
const adress = document.getElementById("adress_input");
const content = document.getElementById("info-input");
const button = document.getElementById("hinzufuegen");
const overview = document.getElementById("Uebersicht");
const bestaetigung = document.getElementById("deleteModal")
const confirmButton = document.getElementById("confirmDelete");
const cancelButton = document.getElementById("cancelDelete");

let filter = "alle"
let loeschID = null;

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



    confirmButton.addEventListener("click", function(){
            auftrag_loeschen(loeschID);
            bestaetigung.style.display = "none"
        })

    cancelButton.addEventListener("click", function(){
            bestaetigung.style.display = "none"  
        })

    for (const auftrag of anzuzeigen){
        const li = document.createElement("li")
        const done = document.createElement("button")
        const remove = document.createElement("button")
        const bearbeitet = document.createElement("button")
        const buttons =  document.createElement("div")

        li.classList.add("liste")
        buttons.classList.add("change_btn")

        li.textContent  = auftrag.name + " - " + auftrag.adresse + " - " + auftrag.content


        bearbeitet.textContent = "IN BEARBEITUNG"
        bearbeitet.addEventListener("click", function(){
            auftrag_aktualisieren(auftrag.firestoreId, {bearbeitet: true, erledigt: false});
        })    
        buttons.appendChild(bearbeitet)

        done.textContent = "DONE"
        done.addEventListener("click", function(){
            auftrag_aktualisieren(auftrag.firestoreId, {erledigt: true, bearbeitet: false});
        })
        buttons.appendChild(done)

        
        remove.textContent =  "DELETE"  
        remove.addEventListener("click", function(){
            bestaetigung.style.display = "flex"

            loeschID = auftrag.firestoreId
        })    

        buttons.appendChild(remove)   
   
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