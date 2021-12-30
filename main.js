(function(){
    // select karne ke lia
    let btnAddFolder = document.querySelector("#btnAddFolder");
    let divContainer = document.querySelector("#divContainer");
    let pageTemplates = document.querySelector("#pageTemplates");
   //jase hi click ho to kaam karo nuche wala
    btnAddFolder.addEventListener("click", function(){
        let fname = prompt("Folder name?");
        //kuki agar ye nhi to canecl karne pe bhi folder banga
        if(fname == null){
            return;
        }
        //document.querySelector nhi chalta template me is lia content.querySelecto use kia
        let divFolderTemplate = pageTemplates.content.querySelector(".folder");
        //copy kuki agar copy nhi bani to real me change ho jai ga 
        //true se folder ka sari chiz a gyi
        let divFolder = document.importNode(divFolderTemplate, true);

        let divName = divFolder.querySelector("[purpose='name']");
        //means process to type and bane tak ke process karne ke lia
        divName.innerHTML = fname;
        divContainer.appendChild(divFolder);

    });
})();