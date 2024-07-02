import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";


export const validate = (payload, setInvalidFields)=>{
    let invalids = 0;
    const formatPayload = Object.entries(payload);
    for(let i of formatPayload){
        if(i[1].trim() ==='') {
            invalids++
            setInvalidFields(prev=>[...prev,{name: i[0], mes:'Require this field'}])
        }
    }


    for(let i of formatPayload){
        switch(i[0]){
            case 'email':
                const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                if(!i[1].match(regex)){
                    invalids++
                    setInvalidFields(prev=>[...prev,{name: i[0], mes:'Email không hợp lệ'}])
                }
                break;
            case 'password':
                if(i[1].length < 8 ){
                    invalids++
                    setInvalidFields(prev=>[...prev,{name: i[0], mes:'Mật khẩu ít nhất 8 ký tự'}])
                }
                break;
                case 'mobile':
                    if(i[1].length < 9 ){
                        invalids++
                        setInvalidFields(prev=>[...prev,{name: i[0], mes:'Điện thoại tối đa 10 số'}])
                    }
                    break;
            default:
                break;
        }
    }

    return invalids;
}


export const formatMoney = number => Number(number?.toFixed(1)).toLocaleString()


// export const renderStarFromNumber = (number, size)=>{
//     if(!Number(number)) return
//     const stars = []
//     for(let i=0; i<+number;i++) stars.push(<FaStar color="orange" size={size || 16} /> )
//     for(let i=5; i>+number;i--) stars.push(<FaRegStar color="orange" size={size || 16} /> )
//     return stars
// }


export const renderStarFromNumber = (number, size) => {
    if (!Number(number) || number < 0 || number > 5) return [];

    const stars = [];
    for (let i = 0; i < 5; i++) {
        if (i < number) {
            stars.push(<FaStar key={i} color="orange" size={size || 16} />);
        } else {
            stars.push(<FaRegStar key={i} color="gray" size={size || 16} />);
        }
    }
    return stars;
};



export const generateRange = (start,end) =>{
    const length = end + 1 -start
    return Array.from({length},(_,index)=> start + index)

}



export function getBase64(file){
    if(!file) return ''
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload=()=>resolve(reader.result);
        reader.onerror=error => reject(error);
    })
}



