import { Button, Divider, FormControl, FormLabel, HStack, Input, InputGroup, InputRightElement, Stack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useNavigate } from "react-router";

import axios from 'axios';

function SignUp() {
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show);

    const [username, setUsername] = React.useState()
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    const toast = useToast();

    const submitHandler = async () => {
      if (!name || !email || !password || !username){
        toast({
          title: 'Please fill all the fields.',
          
          status: 'warning',
          duration: 3000,
          isClosable: true,
        })

        return;
      }

      try{
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };

        // console.log(username)

        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/user/register`, {username, name, email, password}, config);

        // console.log(res);

        const {data} = res;

        if(data){
          toast({
            title: 'Account created.',
            description: "We've created your account for you.",
            status: 'success',
            duration: 5000,
            isClosable: true,
          })

          localStorage.setItem('userInfo', JSON.stringify(data));

          navigate('/chats');
        }
      }
      catch(err){
        toast({
          title: 'Error',
          description: err.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }

    }

  return (
    <Stack spacing="30">
    <Stack spacing="1">
    <FormControl>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input borderColor="rgba(54, 54, 54, 0.564)" variant='outline' id="email" type="email" onChange={(e) => setEmail(e.target.value)} />
      </FormControl>
    <FormControl>
        <FormLabel htmlFor="username">Username</FormLabel>
        <Input borderColor="rgba(54, 54, 54, 0.564)" variant='outline' id="username" type="text" onChange={(e) => setUsername(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input borderColor="rgba(54, 54, 54, 0.564)" variant='outline' id="name" type="text" onChange={(e) => setName(e.target.value)}/>
      </FormControl>
      
      

      <FormControl>
        <FormLabel htmlFor="password">Password</FormLabel>
        <InputGroup size='md'>
<Input
  id="password"
  pr='4.5rem'
  type={show ? 'text' : 'password'}
 
  borderColor="rgba(54, 54, 54, 0.564)" variant='outline'
  onChange={(e) => setPassword(e.target.value)}
/>
<InputRightElement width='4.5rem'>
  <Button h='1.75rem' size='sm' onClick={handleClick}>
    {show ? 'Hide' : 'Show'}
  </Button>
</InputRightElement>
</InputGroup>
        {/* <Input borderColor="rgba(54, 54, 54, 0.564)" variant='outline' id="email" type="email" /> */}
      </FormControl>
      
    </Stack>
    
    <Stack spacing="1">
      <Button variant="solid" colorScheme='blue' onClick={submitHandler}>Sign Up</Button>
      <HStack>
        <Divider />
        
      </HStack>
      
    </Stack>
   </Stack>
  )
}

export default SignUp