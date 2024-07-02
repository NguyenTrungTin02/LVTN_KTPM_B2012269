
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import { useEffect } from "react";
import { apiCreateOrder } from "../apis";
import Swal from "sweetalert2";
import { Path } from "three/src/Three.js";
import { useNavigate } from "react-router-dom";
import path from "../utils/path";

// This value is from the props in the UI
const style = {"layout":"vertical"};




// Custom component to wrap the PayPalButtons and show loading spinner
const ButtonWrapper = ({currency,showSpinner,amount,payload, setIsSuccess}) => {
    const [{ isPending, options },dispatch] = usePayPalScriptReducer();

    const navigate= useNavigate()

    useEffect(()=>{
        dispatch({
            type:'resetOptions',
            value:{
                ...options, currency: currency
            }
        })
    },[currency,showSpinner])

    const handleSaveOrder=async()=>{
        
        const response = await apiCreateOrder({...payload,status:'Succeed'})
        if(response.success){
            setIsSuccess(true)
            Swal.fire('Thành công','Thanh toán đơn hàng thành công','success').then(()=>{navigate(`/${path.HISTORY_ORDER}`)})
        }

    }
    return (
        <>
            { (showSpinner && isPending) && <div className="spinner" /> }
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[style,currency,amount]}
                fundingSource={undefined}
                createOrder={(data,actions)=>{
                    return actions.order.create({
                        purchase_units:[{amount: {currency_code: currency, value:amount}}]
                   }).then(orderId=>orderId)
                }}
                onApprove={(data,actions)=>actions.order.capture().then(async(response)=>{
                    if(response.status === 'COMPLETED'){
                        handleSaveOrder()
                    }
                })}
            />
        </>
    );
}

export default function Paypal({amount,payload,setIsSuccess}) {
    return (
        <div style={{ maxWidth: "750px", minHeight: "200px", margin:'auto' }}>
            <PayPalScriptProvider options={{ clientId: "test", components: "buttons", currency: "USD" }}>
                <ButtonWrapper setIsSuccess={setIsSuccess} payload={payload} currency={'USD'} amount={amount} showSpinner={false} />
            </PayPalScriptProvider>
        </div>
    );
}