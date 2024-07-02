/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./public/index.html"
  ],
  theme: {
    fontFamily:{
      main:["Roboto", 'sans-serif']
    },
    extend: {
      width:{
        main:'1400px'
      },
      gridRow:{
        'span-7' : 'span 7/ span 7' 
      },
      gridTemplateRows :{
        '10' : 'repeat(10,minmax(0,1fr))',
        'layout':'200px minmax(900px,1fr) 100px',
      }
      ,
      backgroundColor:{
        main:'#819B80',
        overplay:'rgba(0,0,0,0.2)'
      },
      colors:{
        main:'red'
      },
      flex:{
        '2' : '2 2 0%',
        '3' : '3 3 0%',
        '4' : '4 4 0%',
        '5' : '5 5 0%',
        '6' : '6 6 0%',
        '7' : '7 7 0%',
        '8' : '8 8 0%',
      },
      keyframes: {
        'slide-top' :{
          '0%': {
            '-webkit-transform': 'translateY(0)',
                   transform: 'translateY(0)',
          },
          '100%': {
           ' -webkit-transform': 'translateY(-20px)',
                   transform : 'translateY(-20px)',
          }
        }
      },
      animation:{
        'slide-top':'slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;'
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/forms'),
  ],
}