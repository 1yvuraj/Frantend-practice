
//more optimize approach -> DRYC(don' repeat your code)
//one code for every eventListener on divFolder
(function(){
    // select karne ke lia
    let addFolderBtn = document.querySelector(".btnn");
    let folderTemplateId = document.querySelector("#my-template");
    let foldersCont = document.querySelector(".folders-container");
    let breadCrumb = document.querySelector("#breadcrumb");
    let rootPath = document.querySelector(".path");
    let fid = -1;
    let cfid = -1//id of folder you are in
    let folders = [];
    //jase hi click ho to kaam karo nuche wala
    addFolderBtn.addEventListener("click",addFolder);
    //jase hi click ho to kaam karo nuche wala
    rootPath.addEventListener("click",navigateBreadCrumb);

    function navigateBreadCrumb(){
        //kis per click hua breadcrumb me
        let pathToGo = this;
        cfid = parseInt(pathToGo.getAttribute("fid"));

        foldersCont.innerHTML = "";
        folders.filter(f => f.pid == cfid).forEach(f => {
            addFolderHTMLToPage(f.name, f.id, f.pid);
        })
        //removing files in right jis breadcrumb per click sath ke na dekh is lia
        while(this.nextSibling){//removing files in right
            this.parentNode.removeChild(this.nextSibling);
        }
    }
    function addFolder(){
        //folder name do
        let fName = prompt("Enter folder's name : ");
        if(!!fName){
            //ki agar same name to alert aye
            for(let i = 0; i < folders.length; i++){//or use some function
                if(folders[i].name == fName){   
                    //ki agar same name to alert aye
                    alert("'" + fName  + "'" + " already exists please choose another folder name");
                    return;
                }
            }
            fid++;
            //folder me push jis se local storage call me 
            folders.push({
                id : fid,
                name : fName,
                //parent id ki baja se
                pid : cfid
            })
            addFolderHTMLToPage(fName, fid, cfid);

             //data to storage me
            saveDataToStorage();
        }else{
            //ki name dala to alert
            alert("Please enter something");
        }
    }
    // edit feature
    function editFolder(){
        //jonse folder ge edit pe click hua hai
        let divFolder = this.parentNode;
        //select
        let folderName = divFolder.querySelector("[purpose = 'name']");
         // html jo change bo 
        let ofName = folderName.innerHTML;
        //jo dala bo dekhne ke lia
        let newfName = prompt("Enter new folder's name for : " + folderName.innerHTML);
         //click folder id 
        let fid = parseInt(divFolder.getAttribute("fid"));
        if(!!newfName){
            //agar equal nhi to karo
            if(newfName != ofName){
                //matlb ki bo folder me hai to nhi is lia child name same

                let exists = folders.filter(f => f.pid == cfid).some(f => f.name == newfName);
                if(exists == false){
                    let folder = folders.filter(f => f.pid == cfid).find(f => f.name == ofName);
                    folder.name = newfName;

                    //html
                    folderName.innerHTML = newfName;
                    //storage
                    saveDataToStorage();
                }else{
                    alert("folder name already exists");
                }
            }else{
                alert("Please enter new name, not the old one..");
            }
        }else{
            alert("Please enter something");
        }
    }
    
    function deleteFolder(){
        let divFolder = this.parentNode; 
        let fName = divFolder.querySelector("[purpose = 'name']")
        // alert
        let flag = confirm("Do you really want to delete folder : " + fName.textContent + "?");
        //folder id to be deleted
        let fidtbd = divFolder.getAttribute("fid");
        if(flag){
            //jis ki match bo delete
            let exists = folders.some(f => f.pid == fidtbd);
            if(exists == false){
                let fidx = folders.findIndex(f => f.id == fidtbd);
                //remove elem from folders array
                
                folders.splice(fidx, 1);
                //removing from ui
                divFolder.remove();//removing from ui
                //removing from localstorage
                saveDataToStorage();
            }else{
                alert("can't delete. Has childrens");
            }
        }
    }

    function viewItems(){
        //matlb iska parent kon bo lane ke lia
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose = 'name']");
        //iske children ke lia parent id cfid hogi
        cfid = parseInt(divFolder.getAttribute("fid"));

        let aPathTemplate = folderTemplateId.content.querySelector(".path");
        let aPath = document.importNode(aPathTemplate, true);
        
        aPath.innerHTML = divName.innerHTML;
        //mltb child nickalne ke logic
        //mtlb jo line hai root bali to jab hum addfolder kare fir back ke lia
        aPath.setAttribute("fid", cfid);
        aPath.addEventListener("click", navigateBreadCrumb);
        breadCrumb.appendChild(aPath);
        //clean kara
        foldersCont.innerHTML = "";
        // bas back kara to bo child delhne ke lia
        folders.filter(f => f.pid == cfid).forEach(f => {
            addFolderHTMLToPage(f.name, f.id, f.pid);
        })

    }
    function addFolderHTMLToPage(fName, fid, pId){
         //tamplte jab tak copy na karo bo hide hota hai
        //select tamplte ke folder ke content ko
        let divTemp = folderTemplateId.content.querySelector(".folder");
        //copy bane ke lia 
        //true kuki uder content chia folder ka
        //tamplte view hai ki is jase hona chia or copy bana ke karo 
        let divFolder = document.importNode(divTemp, true);

        let nameElem = divFolder.querySelector("[purpose = 'name']");
        let editElem = divFolder.querySelector("[action = 'edit']");
        let deleteElem = divFolder.querySelector("[action = 'delete']");
        let viewElem = divFolder.querySelector("[action = 'view']");
        //set ke lia inspect me
        divFolder.setAttribute("fid", fid);
        divFolder.setAttribute("pid", pId);
        //name change in html
        nameElem.innerHTML = fName;
        //function call
        editElem.addEventListener("click", editFolder);
        deleteElem.addEventListener("click", deleteFolder);
        viewElem.addEventListener("click", viewItems);
         //divContainer jo box hai us me folder ak jo bana bo a jai ga
        foldersCont.appendChild(divFolder);
        
    }
    //folders arry ko localstorage mme add karne ke lia
    function saveDataToStorage(){
        // console.log(folders);
        //folders arry ko localstorage mme add karne ke lia
        //JSON.stringify object ko string convert jis se store ho jai
        let foldersJtoS = JSON.stringify(folders);
        localStorage.setItem("data", foldersJtoS);
    }
    //refesh ke baad to sara data jha hoga
    function loadDataFromStorage(){
         //sare item a jai ge is se
        let foldersFromLocalStorage = localStorage.getItem("data");//in string form
        //kahli na ho
        if(!!foldersFromLocalStorage){
            //JSON.parse kara  jis object  me aye or folders me dalwa lia
            //JSON.parse object me karta hai
            folders = JSON.parse(foldersFromLocalStorage);
            folders.forEach(function(f){
                
                 //jab refresh karte to  id 1 se start hi jati thi is lia ye use kia is se unick aye ga
                if(f.id > fid){
                    fid = f.id;
                }
                //agar ye nhi likho ge to reload me sare local storage a jai ga is lia ye use kia hai
                 if(f.pid === cfid){
                     //html me dekhne ke lia
                    addFolderHTMLToPage(f.name, f.id, cfid); 
                 }
            })
        }
    }
     //refesh hote hi call and sara data show ho jai or ddFolderHTMLToPage call or ban jai ga
    loadDataFromStorage();




})()