import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";


export default function Profile({first_name,last_name,picture_url,bio}) {

    console.log("props in profile component:", props);

    render(){

    return (
        <>
            <div>
                <h1>Profile Page</h1>
                <h4>{first_name}{last_name}</h4>
                <BioEditor />
                <ProfilePic imageUrl={picture_url}/> 
            </div>
        </>
    );
}}
