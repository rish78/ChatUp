import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'

const IndividualUser = ({user, handleFunction}) => {
  return (
    <Box 
        onClick={handleFunction}
        cursor="pointer"
        bg="#E8E8E8"
        _hover={{
        background: "#38B2AC",
        color: "white",
        }}
        w="100%"
        display="flex"
        alignItems="center"
        color="black"
        px={3}
        py={2}
        mb={2}
        borderRadius="lg"
    >
        <Avatar
        mr={2}
        size="md"
        cursor="pointer"
        name={user.name}
        src={`https://robohash.org/${user.username}.png?set=set4`}
      />
        <Box>
        <Text>{user.username}</Text>
        <Text fontSize="xs"><b>Name : </b>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>


    </Box>
  )
}

export default IndividualUser