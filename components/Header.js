import React, {Component} from 'react';
import {Menu, Image} from 'semantic-ui-react';
import {Link} from '../routes';

class HeaderClass extends Component{


    state ={
        userReg:
            <Link route = "/register"><a className="item">Register</a></Link>
    };


    render(){
        return (
        <Menu>

            <Link route = "/">
                <a className="item"><Image src = '../static/Logo.png' size = 'mini'/></a>
            </Link>


            <Link route ='/'>
                <a className="item">Explore</a>
            </Link>
            <Menu.Menu position="right">
                    {this.state.userReg}
            </Menu.Menu>

        </Menu>
    );}
}


export default HeaderClass;



