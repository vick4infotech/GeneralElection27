import {ImageResponse} from 'next/og';
export const alt='General Election 2027 - Nigeria Election Information, Civic Games and Visitor Poll';
export const size={width:1200,height:630};
export const contentType='image/png';
export default function Image(){return new ImageResponse(<div style={{display:'flex',flexDirection:'column',justifyContent:'center',width:'100%',height:'100%',background:'linear-gradient(130deg,#071e32,#0b6549)',padding:80,color:'white',fontFamily:'sans-serif'}}><div style={{fontSize:25,letterSpacing:5,color:'#c6e9cb'}}>NIGERIA • 2027</div><div style={{fontSize:82,fontWeight:800,lineHeight:1.1,marginTop:30}}>General Election<br/>2027</div><div style={{fontSize:29,marginTop:30,color:'#d7ecdf'}}>Election News · Candidates · Play Fix Naija · Community Poll</div></div>,size)}
