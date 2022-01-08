(function(){
    // select karne ke lia
    let btnAddFolder = document.querySelector("#btnAddFolder");
    let divContainer = document.querySelector("#divContainer");
    let pageTemplates = document.querySelector("#pageTemplates");
    let fid = 0;
    let folders = [];
    let cfolderId=-1
    l
    //jase hi click ho to kaam karo nuche wala
    btnAddFolder.addEventListener("click", addFolder);

    function addFolder(){
        
        //folder name do
        let fname = prompt("Enter folder's name");
        //kuki folder name nhi dalo ge to bhi bana de ga is lia !! laga hai
        //!undefined to true hoga;
        //if undefined hoga to alert
        if(fname!=undefined && fname.length>0){
            
            let fidx=folders.findIndex(f=>f.name==fname);
            //fidx nhi hai to bana do warna alert
            if(fidx==-1){
            fid++;
            addFolderHTMLToPage(fname, fid);
           //folder me push jis se local storage call me 
            folders.push({
                id: fid,
                name: fname
                
            });
            //data to storage me
            persistDataToStorage();
           }
           else 
           {
               alert(fname +" alredy exits")
           }

        }
        else{
            alert("please enter something");
        }
    }
    // edit feature
    function editFolder(){
        //jonse folder ge edit pe click hua hai
        let divFolder = this.parentNode; 
        //select
        let divName = divFolder.querySelector("[purpose='name']");
          // alert
        let fname = prompt("Enter new folder's name for " + divName.innerHTML);
        if(!!fname){
            // html jo change bo 
            divName.innerHTML = fname;
            //click folder id 
            let fid = parseInt(divFolder.getAttribute("fid"));
            //sare folder ae ge or jise ki id same ho jai bo folder a jai ga fir change
            let folder = folders.find(function(f){
                return f.id == fid;
            });
            //name change
            folder.name = fname;

            persistDataToStorage();
        }
    }

    function deleteFolder(){
        let divFolder = this.parentNode; 
        let divName = divFolder.querySelector("[purpose='name']");
         // alert
        let flag = confirm("Do you want to delete " + divName.innerHTML);
        if(flag){
            divContainer.removeChild(divFolder);
             //click folder id 
            let fid = parseInt(divFolder.getAttribute("fid"));
             //sare folder ae ge or jise ki id same ho jai bo folder a jai ga fir change
            let idx = folders.findIndex(function(f){
                return f.id == fid;
            });
            //idx a gya to bo hat jai ga
            folders.splice(idx, 1);

            persistDataToStorage();
        }
    }
    function viewFolder(){
        alert("hloo");

    }
    function addFolderHTMLToPage(fname, fid){
        //tamplte jab tak copy na karo bo hide hota hai
        //select tamplte ke folder ke content ko
        let divFolderTemplate = pageTemplates.content.querySelector(".folder");
        //copy bane ke lia 
        //true kuki uder content chia folder ka
        //tamplte view hai ki is jase hona chia or copy bana ke karo 
        let divFolder = document.importNode(divFolderTemplate, true);

        let divName = divFolder.querySelector("[purpose='name']");
        let spanEdit = divFolder.querySelector("[action='edit']");
        let spanDelete = divFolder.querySelector("[action='delete']");
        let spanView= divFolder.querySelector("[action='view']");
        //name change in html
        divName.innerHTML = fname;
        //function call
        spanEdit.addEventListener("click", editFolder);
        //function call
        spanDelete.addEventListener("click", deleteFolder);
        //function call
        spanView.addEventListener("click", viewFolder);
        divFolder.setAttribute("fid", fid);
        //divContainer jo box hai us me folder ak jo bana bo a jai ga
        divContainer.appendChild(divFolder);
    }
 //folders arry ko localstorage mme add karne ke lia
    function persistDataToStorage(){
        //folders arry ko localstorage mme add karne ke lia
        //JSON.stringify object ko string convert jis se store ho jai
        let fjson = JSON.stringify(folders);
        localStorage.setItem("data", fjson);
    }
    //refesh ke baad to sara data jha hoga
    function loadDataFromStorage(){
        //sare item a jai ge is se
        let datafromlocalstorage = localStorage.getItem("data");
        //kahli na ho
        if(!!datafromlocalstorage){
            //JSON.parse kara  jis object  me aye or folders me dalwa lia
            //JSON.parse object me karta hai
            folders = JSON.parse(datafromlocalstorage);

            let maxId = -1;
            // folder ka array ka chiz f me gya
            folders.forEach(f => {
                //html me dekhne ke lia
                addFolderHTMLToPage(f.name, f.id);
                //jab refresh karte to  id 1 se start hi jati thi is lia ye use kia is se unick aye ga
                if(f.id > maxId){
                    maxId = f.id;
                }
            });

            fid = maxId;
        }
    }
    //refesh hote hi call and sara data show ho jai or ddFolderHTMLToPage call or ban jai ga
    loadDataFromStorage();
})();