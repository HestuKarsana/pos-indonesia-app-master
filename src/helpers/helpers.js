import apiConfig from '../services/api/config';

export function CategoryNews(str){
    return (str == 'NEWS') ? 'Berita' : 'Pengumuman';
}

export function ContentSnippet(str) {
    return str
        .split(/\s+/)
        .slice(0, 5)
        .join(" ") + "...";
}

export function GetImage(content) {
    var myRegexp = new RegExp(/<img.*?src="(.*?)"/);
    var match = myRegexp.exec(content);
    if (match) {
        return match[1];
    }
}

export function GetFileExtension(filename) {
    return filename.split('.').pop();
}

export function doesFileExist(urlToFile)
{
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();

    if (xhr.status == "404") {        
        return false;
    } else {        
        return true;
    }
}

export function generatePathPhoto(cur_NIP) {
    var NIP = cur_NIP.trim().replace(" ", "");
    // var NIP_photo = NIP.replace("/", "_");

    var photo_path = "";
    var photo_folder = "";
    var photo_name = "";

    var assetUrl = `${apiConfig.SERVER_WEB_URL}${apiConfig.ESS_WEB_APP}${apiConfig.PROFILE_IMG_URL}`;  
    //http://exml.serveftp.net:8081/ci2.simpeg.basarnas.go.id/assets/photo/200912/198007162009121000.jpg

    if (NIP.trim().length == 18) {
        photo_folder = NIP.substr(8, 6);
        photo_name = `${NIP}.jpg`;
        photoPath = `/${photo_folder}/${photo_name}`;
    } 
    else if (NIP.trim().length == 9) {
        photo_folder = "nip_lama/";
        photo_name = `${NIP}.jpg`;
        photo_path = `/${photo_folder}/${photo_name}`;        
    } else {
        photo_folder = "perumnas/";        
        photo_name = `${NIP}.jpg`;
        photo_path = `/${photo_folder}/${photo_name}`;   
    }
    var photoUrl = `${assetUrl}${photoPath}`;
    
        // if (doesFileExist(photoUrl) === true) {
        //     photo_path = photoUrl;
        // }
        // else {
        //     photo_path = `${assetUrl}/anonymous.jpg`;
        // }

    return photoUrl;
}

