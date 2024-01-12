import { IconHeart } from '@tabler/icons-react';
import { Card, Image, Text, Group, Badge, Button, ActionIcon } from '@mantine/core';

import classes from './card.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


export function CardInform({user}) {




  const navigate = useNavigate();
  const { t } = useTranslation();
  const gotopage = () =>{
  return  navigate(`/profile/${user._id}`)
  }
  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section>
        <Image src={user?.avatar} alt="#" height={200} />
      </Card.Section>

      <Card.Section className='ml-1' mt="md" >
        <Group justify="apart">
          <Text fz="lg" fw={500} className=''>
         Email: {user?.email}
          </Text>
        
        </Group>
        <Text className='text-[18px] font-medium' >
        {t('fullname')}: {user?.fullname}
        </Text>
      </Card.Section>

      <Card.Section className='ml-1 '>
     {/*    <Text mt="md" className={classes.label} c="dimmed"> */}
          {
             user.profile.phone? 
             <div>
              <Text mt="md" className='text-[18px] font-medium'  c="dimmed">
              SDT:{user.phone}
                </Text>  
             </div> 
             :<></>

          }
      {/*   </Text> */}
        <Group gap={7} mt={5}>
        
        </Group>
      </Card.Section>

      <Group mt="xs">
        <button className='bg-blue-400 px-2 py-2 rounded-md' radius="md" style={{ flex: 1 }} variant='filled'   >
    
          <Text className='no-underline font-thin' onClick={gotopage} >Go to profile</Text>
        </button>
      
      </Group>
    </Card>
  );
}