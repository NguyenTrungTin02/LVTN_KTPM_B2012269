import React , {useState, useCallback, useEffect} from 'react'
import { Button, InputFiled } from '../../components'
import { apiFinalRegister, apiForgotPassword, apiLogin, apiRegister } from '../../apis/user'
import Swal from 'sweetalert2'
import { useNavigate, useSearchParams } from 'react-router-dom'
import path from '../../utils/path'
import {login} from '../../app/user/userSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { validate } from '../../utils/helpers'


const Login = () => {
  const navigate = useNavigate();
  const dispatch= useDispatch();
  

  const [payload, setPayLoad] = useState({
    email:'',
    password:'',
    name:'',
    mobile:''
  })


  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [invalidFields, setInvalidFields] = useState([])
  const [token, setToken] = useState('')
  const [verifiedEmail, setVerifiedEmail] = useState(false)

  const [searchParams] = useSearchParams()


  const resetPayload = ()=>{
        setPayLoad({
          email:'',
          password:'',
          name:'',
          mobile:''
        })
  }

  const [email, setEmail] = useState('')

  const handleForgotPassword=async()=>{
      const response= await apiForgotPassword({email})
      if(response?.success){
        toast.info(response.message,{theme:"colored"})
        

      }else toast.info(response.message)
  }


  useEffect(()=>{
    resetPayload()
  },[isRegister])

  const handleSubmit= useCallback(async()=>{
    const {name,mobile,...data} = payload;
    const invalids = isRegister ? validate(payload,setInvalidFields) : validate(data,setInvalidFields)


    if(invalids === 0){
      if(isRegister){
        const response = await apiRegister(payload)
        if(response?.success){
          setVerifiedEmail(true)
          // Swal.fire('Đăng ký thành công',
          //           response.message,'success').then(()=>{
          //             setIsRegister(false)
          //             resetPayload()
          //           })
        }
        else{
          Swal.fire('Đăng ký thất bại',response.message,'error')
        }
  
      }else{
        const rs = await apiLogin(data)
        if(rs?.success){
          
          dispatch(login({isLoggedIn: true, token:rs.token}))
          searchParams.get('redirect') ? navigate(searchParams.get('redirect')): navigate(`/${path.HOME}`)
        }
        else{
          Swal.fire('Đăng nhập thất bại',rs.message,'error')
        }
      }
    }
   
  },[payload,isRegister,navigate,dispatch])



  const finalRegister = async ()=>{
    const response = await apiFinalRegister(token)
    if(response?.success){
      Swal.fire('Đăng ký thành công',
                    response.message,'success').then(()=>{
                      setIsRegister(false)
                      resetPayload()
                    })

    }else{
      Swal.fire('Đăng ký thất bại',response.message,'error')
    }

    setVerifiedEmail(false)
    setToken('')
    
  }


  return (
    <div className='w-screen h-screen relative'>
      {verifiedEmail && 
<div className='absolute top-0 left-0 right-0 bottom-0 bg-white z-50 flex justify-center items-center'>
    <div className='w-[500px] rounded-md p-8 flex flex-col items-center border'>
        <h3 className='text-[28px] font-semibold mb-5'>Xác thực Email</h3>
        <label >Nhập mã xác thực được gửi trong email:</label>
        <input 
            type='text' 
            value={token} 
            onChange={e => setToken(e.target.value)} 
            className='p-2 border rounded-md outline-none text-center'
            style={{textAlign: 'center'}} // Center text horizontally
        />
        <button 
            type='button' 
            className='py-2 bg-red-500 font-semibold text-white rounded-md ml-4 w-[80px] mt-2'
            onClick={finalRegister}
        >
            Gửi
        </button>
    </div>
</div>
}


      {isForgotPassword &&  
<div className='absolute top-0 left-0 bottom-0 right-0 bg-white flex justify-center items-center z-50 border'>
    <div className='border w-[600px] rounded-md flex flex-col items-center'>
        <h1 className='text-[28px] font-semibold mb-5'>Quên mật khẩu</h1>
        <div className='flex flex-col gap-2'>
            <label htmlFor='email'>Nhập email đã đăng ký tài khoản:</label>
            <input
                type='text'
                id='email'
                placeholder='email@gmail.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
                className='w-[500px] p-2 border outline-none'
            />
        </div>
        <div className="flex justify-center gap-4">
           
            <Button
                children='Quay lại'
                handleOnclick={() => setIsForgotPassword(false)}
                style={`px-4 py-2 rounded-md text-white text-semibold bg-gray-500 my-2`}
            />
             <Button
                children='Gửi'
                handleOnclick={handleForgotPassword}
                style={`px-4 py-2 rounded-md text-white text-semibold bg-red-500 my-2 w-[80px]`}
            />
        </div>
    </div>
</div>
}



      <div className='absolute top-0 bottom-0 left-0 right-0 items-center justify-center flex'>
        <div className='p-8 border flex flex-col items-center rounded-md min-w-[500px]'>
            <h1 className='text-[28px] font-semibold mb-8'>{isRegister ? `Đăng ký`:`Đăng nhập`}</h1>

           {isRegister &&  <InputFiled 
              value={payload.name}
              setValue={setPayLoad}
              nameKey='name'
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
              fullWith
              placeholder="Họ và tên"
              />
              
              
              }


            {isRegister &&  <InputFiled 
              value={payload.mobile}
              setValue={setPayLoad}
              nameKey='mobile'
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
              fullWith
              placeholder="Số điện thoại"
              />}

            <InputFiled 
              value={payload.email}
              setValue={setPayLoad}
              nameKey='email'
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
              fullWith/>

            <InputFiled 
              value={payload.password}
              setValue={setPayLoad}
              nameKey='password'
              type='password'
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
              fullWith
              placeholder="Mật khẩu"
              />

              <Button
                
                fw
                handleOnclick={handleSubmit}>{isRegister?`Đăng ký`:`Đăng nhập`}</Button>

                <div className='flex items-center w-full justify-between my-2 text-sm'>
                  {!isRegister && <span className='text-blue-500 hover:underline cursor-pointer' onClick={()=>{setIsForgotPassword(true)}}>Quên mật khẩu</span>}
                  {!isRegister && <span 
                  onClick={()=>setIsRegister(true)}
                  className='text-blue-500 hover:underline cursor-pointer'>Tạo tài khoản</span>}
                  {isRegister && <span 
                  onClick={()=>setIsRegister(false)}
                  className='text-blue-500 hover:underline cursor-pointer'>Đăng nhập</span>}
                </div>
        </div>
      </div>
    </div>
  )
}

export default Login