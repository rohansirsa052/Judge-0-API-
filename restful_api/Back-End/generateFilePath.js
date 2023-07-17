const fs= require("fs");
const path= require("path");
const {v4: uuid}= require("uuid")

const file_path= path.join(__dirname, "./codes");

console.log(file_path);

function generateFile(language, code){

  if(!fs.existsSync(file_path)){
         fs.mkdir( file_path, (err)=>{
            if(err) throw err;      
            else
            console.log("folder Created");

     })
    }
    const unique_id= uuid();
    const cpp_file_name  =    `${unique_id}.${language}`;

    const file=  path.join(file_path, cpp_file_name );
 
    console.log(file);
   // console.log(cpp_file_path);

 fs.writeFile(file, code,  (err)=>{
            if (err) throw err;
            else
            console.log("file created")
 });


       return file;
}

module.exports= generateFile;