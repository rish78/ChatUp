import React, { useEffect } from 'react';
import {
    Box,
    Button,
    Checkbox,
    Container,
    Divider,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Stack,
    Text,
    useBreakpointValue,
    useColorModeValue,
    Image,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel
  } from '@chakra-ui/react';
import Login from '../components/Login';
import SignUp from '../components/SignUp';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
       

        if(userInfo) {
            navigate('/chats');
        }
    }, [navigate]);
  return (
    <Container maxW="lg" py={{ base: '2', md: '4' }} px={{ base: '0', sm: '8' }}>
    <Stack spacing="0">
      <Stack spacing="2">
      <Box align="center">
        <Image src="https://i.ibb.co/55wshZH/c5ce4727f838466bae78e3c7113d230a-removebg-preview.png" />
        </Box>
        
      </Stack>
      <Box
        py={{ base: '0', sm: '8' }}
        px={{ base: '4', sm: '10' }}
        
        bg="rgba(254, 251, 254, 0.564)"
        boxShadow={{ base: 'none', sm: useColorModeValue('md', 'md-dark') }}
        borderRadius={{ base: 'none', sm: 'xl' }}
      >
      <Tabs variant='soft-rounded' >
  <TabList>
    <Tab width="50%">Sign In</Tab>
    <Tab width="50%">Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login />
    </TabPanel>
    <TabPanel>
      <SignUp />
    </TabPanel>
  </TabPanels>
</Tabs>

        {/* <Stack spacing="6">
          <Stack spacing="5">
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input id="email" type="email" />
            </FormControl>
            
          </Stack>
          
          <Stack spacing="6">
            <Button variant="solid" colorScheme='blue'>Sign in</Button>
            <HStack>
              <Divider />
              
            </HStack>
            
          </Stack>
        </Stack> */}
      </Box>
    </Stack>
  </Container>
  )
}

export default HomePage