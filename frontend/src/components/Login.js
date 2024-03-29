import { Button, Divider, FormControl, FormLabel, HStack, Input, InputGroup, InputRightElement, Stack, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from "react-router";

const Login = () => {
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    const toast = useToast();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const navigate = useNavigate();

    const submitHandler = async(req, res) => {
      if (!email || !password){
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

        const {data} = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/user/login`, {email, password}, config);

        if(data){
          toast({
            title: 'User logged in',
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
          description: err.response.data.error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
  return (
     <Stack spacing="6">
          <Stack spacing="5">
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input borderColor="rgba(54, 54, 54, 0.564)" variant='outline' id="email" type="email" onChange={(e) => setEmail(e.target.value)} />
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
          
          <Stack spacing="6">
            <Button variant="solid" colorScheme='blue' onClick={submitHandler}>Sign in</Button>
            <HStack>
              <Divider />
              
            </HStack>
            
          </Stack>
         </Stack>
  )
}

export default Login