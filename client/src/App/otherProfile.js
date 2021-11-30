import { useParams } from "react-router";


export default function otherProfile() {
    const {id} = userParams();
    useEffect(() => {
    
        fetch(() => {
            
        })
    }, [id]);
    
    
    
    return (
        <div>
            
        </div>
    );
}
