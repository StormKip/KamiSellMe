import React, {Component} from 'react'
import { Button, Divider, Grid, Header, Icon, Container, Segment,Message } from 'semantic-ui-react';
import {Link, Router} from '../routes.js';
import web3 from '../ethereum/web3.js';
import factory from '../ethereum/factory';

const SegmentExamplePlaceholderGrid = ( ) =>(

            <Container>
                <Grid columns={2} stackable textAlign='center'>


                    <Grid.Row verticalAlign='middle'>
                        <Grid.Column>
                            <Header icon>
                                <Icon name='search' />
                                Explore
                            </Header>
                            <Link route = "/marketplace/explore">
                                <a><Button basic color='red' fluid>Explore</Button></a></Link>
                        </Grid.Column>
                        <Divider vertical className='grid'>Or</Divider>
                        <Grid.Column >
                            <Header icon>
                                <Icon name='users' />
                                Users
                            </Header>
                            <Button.Group fluid>
                                <Button basic color="red" onClick={event => {Router.pushRoute(`/register`)}}>Register</Button>
                                <Button.Or />
                                <Button basic color="black" onClick={async ()=>{
                                    const accounts = await web3.eth.getAccounts();
                                    const userExist = await factory.methods.isCreated().call({from: accounts[0]});

                                    if(userExist){
                                        Router.pushRoute(`/user/${accounts[0]}/`);
                                    }else{
                                        return;
                                    }
                                }}>Login</Button>
                            </Button.Group>
                        </Grid.Column>
                    </Grid.Row>

                </Grid>

            </Container>
        )




export default SegmentExamplePlaceholderGrid
