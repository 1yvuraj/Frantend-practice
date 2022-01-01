(function(){
    // select karne ke lia
    let btnAddFolder = document.querySelector("#btnAddFolder");
    let divContainer = document.querySelector("#divContainer");
    let pageTemplates = document.querySelector("#pageTemplates");
    let y=0;
    let folders = [];
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
        // html jo change bo 
        divName.innerHTML = fname;
        divContainer.appendChild(divFolder);
        // bas quik id a jai sab ki;
        divFolder.setAttribute("fid",++y);
        // delete karne ki vidhi
        let spanDelete=divFolder.querySelector("[action='delete']");
        spanDelete.addEventListener("click", function(){
            // alert
            //divName.innerHTML kara fname nhi kuki closer hai to delete ke popup per purna name a rha tha is lia ivName.innerHTML use kia
           let flag= alert("Do you want to delete the folder"+" " +divName.innerHTML);
            if(flag){
           divContainer.removeChild(divFolder);

            let idx = folders.findIndex(f => f.id == parseInt(divFolder.getAttribute("fid")));
            folders.splice(idx, 1);
            persistFolders();
            }
        });
        // edit feature
        let spanEdit=divFolder.querySelector("[action='edit']");
        spanEdit.addEventListener("click", function(){
            // alert
            let fname=prompt("Enter the new folder name")
            if(!fname){
                return;
            }


            let divName = divFolder.querySelector("[purpose='name']");
            // html jo change bo 
            divName.innerHTML = fname;
            //get attribute se id sectect
            let folder = folders.find(f => f.id == parseInt(divFolder.getAttribute("y")));
            folder.name = fname;
            persistFolders();
        });
        //
        divContainer.appendChild(divFolder);
        //oush in folder
        folders.push({
            id: y,
            name: fname
        });
        persistFolders();

    });
    //localstorage
   
    function persistFolders(){
        console.log(folders);
        let fjson = JSON.stringify(folders);
        localStorage.setItem("data", fjson);
    }

})();







(function(){
    let btnAddFolder = document.querySelector("#btnAddFolder");
    let divContainer = document.querySelector("#divContainer");
    let pageTemplates = document.querySelector("#pageTemplates");
    let fid = 0;
    let folders = [];

    btnAddFolder.addEventListener("click", addFolder);

    function addFolder(){
        let fname = prompt("Enter folder's name");
        if(!!fname){
            fid++;
            addFolderHTMLToPage(fname, fid);

            folders.push({
                id: fid,
                name: fname
            });
            persistDataToStorage();
        }
    }

    function editFolder(){
        let divFolder = this.parentNode; 
        let divName = divFolder.querySelector("[purpose='name']");

        let fname = prompt("Enter new folder's name for " + divName.innerHTML);
        if(!!fname){
            divName.innerHTML = fname;

            let fid = parseInt(divFolder.getAttribute("fid"));
            let folder = folders.find(function(f){
                return f.id == fid;
            });
            folder.name = fname;

            persistDataToStorage();
        }
    }

    function deleteFolder(){
        let divFolder = this.parentNode; 
        let divName = divFolder.querySelector("[purpose='name']");

        let flag = confirm("Do you want to delete " + divName.innerHTML);
        if(flag){
            divContainer.removeChild(divFolder);

            let fid = parseInt(divFolder.getAttribute("fid"));
            let idx = folders.findIndex(function(f){
                return f.id == fid;
            });
            folders.splice(idx, 1);

            persistDataToStorage();
        }
    }

    function addFolderHTMLToPage(fname, fid){
        let divFolderTemplate = pageTemplates.content.querySelector(".folder");
        let divFolder = document.importNode(divFolderTemplate, true);

        let divName = divFolder.querySelector("[purpose='name']");
        let spanEdit = divFolder.querySelector("[action='edit']");
        let spanDelete = divFolder.querySelector("[action='delete']");

        divName.innerHTML = fname;
        spanEdit.addEventListener("click", editFolder);
        spanDelete.addEventListener("click", deleteFolder);
        divFolder.setAttribute("fid", fid);

        divContainer.appendChild(divFolder);
    }

    function persistDataToStorage(){
        let fjson = JSON.stringify(folders);
        localStorage.setItem("data", fjson);
    }

    function loadDataFromStorage(){
        let fjson = localStorage.getItem("data");
        if(!!fjson){
            folders = JSON.parse(fjson);
            let maxId = -1;
            folders.forEach(f => {
                addFolderHTMLToPage(f.name, f.id);
                if(f.id > maxId){
                    maxId = f.id;
                }
            });

            fid = maxId;
        }
    }

    loadDataFromStorage();
})();