/**
 * github: https://github.com/luofei614/SocketLog
 * @author luofei614<weibo.com/luofei614>
 */ 
document.addEventListener('DOMContentLoaded', init, false);
function init()
{
    var protocol=document.getElementById('protocol');
    var address=document.getElementById('address');
    var port=document.getElementById('port');
    var full_address=document.getElementById('full_address');
    var client_id=document.getElementById('client_id');
    var open=document.getElementById('open');

    if(localStorage.getItem('protocol'))
    {
        protocol.value=localStorage.getItem('protocol'); 
    }
    if(localStorage.getItem('address'))
    {
        address.value=localStorage.getItem('address'); 
    }
    if(localStorage.getItem('port'))
    {
        port.value=localStorage.getItem('port'); 
    }

    full_address.value=protocol.value+'://'+address.value+':'+port.value; 

    if(localStorage.getItem('client_id'))
    {
        client_id.value=localStorage.getItem('client_id'); 
    }
    if(localStorage.getItem('open'))
    {
        open.checked=localStorage.getItem('open') == 'false' ? false:true;
    }
    var status=localStorage.getItem('status');

    if(status)
    {
        var text='';

        switch(status)
        {
            case "open":
                text='链接成功';
            break;
            case "close":
                text='链接断开';
            break;
            case "error":
                text='链接失败';
            break;
            default:
              alert('运行状态异常');
            break;
        }
        document.getElementById('status').innerHTML=text; 
    }

    document.getElementById('save').addEventListener('click',save,false);

    protocol.addEventListener('input',addressChange,false);
    address.addEventListener('input',addressChange,false);
    port.addEventListener('input',addressChange,false);

    protocol.addEventListener('porpertychange',addressChange,false);
    address.addEventListener('porpertychange',addressChange,false);
    port.addEventListener('porpertychange',addressChange,false);

}

function addressChange(e){
    var protocol=document.getElementById('protocol').value;
    var address=document.getElementById('address').value;
    var port=document.getElementById('port').value;
    document.getElementById('full_address').value=protocol+'://'+address+':'+port;
}

function save()
{
    var protocol=document.getElementById('protocol').value;
    var address=document.getElementById('address').value;
    var port=document.getElementById('port').value;
    var client_id=document.getElementById('client_id').value;
    var open=document.getElementById('open').checked;
    localStorage.setItem('protocol',protocol);
    localStorage.setItem('address',address);
    localStorage.setItem('port',port);
    localStorage.setItem('client_id',client_id);
    localStorage.setItem('open',open);
    chrome.extension.getBackgroundPage().ws_restart();
    window.close();
}

