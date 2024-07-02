import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

const MarkdownEditor=({label,value,changeValue,name,invalidField,setInvalidField,setIsFocusDescription})=> {
 
  return (
    <div className='flex flex-col'>
        <span>{label}</span>

      <Editor
      apiKey='pl2erwj5hso5z3jcxuwhsibpw5ka828t1hx7onbcwunmnk1p'
        initialValue={value}
        init={{
          height: 300,
          menubar: true,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar: 'undo redo | formatselect | ' +
          'bold italic backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
        onChange={e=>changeValue(prev=>({...prev,[name]:e.target.getContent()}))}
        onFocus={()=>{
          setInvalidField && setInvalidField([])
        }}

        
      />
       {invalidField?.some(el=>el.name === name ) && <small className='text-main text-sm'>{invalidField?.find(el=>el.name===name)?.mes}</small>}
    </div>
  );
}


export default MarkdownEditor