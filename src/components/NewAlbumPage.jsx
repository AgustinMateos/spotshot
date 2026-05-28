'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import ImageWithLoader from '@/components/ImageWithLoader';
const NewAlbumPage = () => {
  const router = useRouter();
  const { token, logout, loading } = useAuth();

  const [step, setStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formData, setFormData] = useState({
    type: 'free-surfers',
    school: '',
    location: '',
    date: '',
    startTime: '10:30',
    endTime: '11:30',
    basePrice: 5,
    selectedPacks: [],
  });

  const [packsCatalog, setPacksCatalog] = useState([]);
  const [isLoadingPacks, setIsLoadingPacks] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [creatingSession, setCreatingSession] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  // ← ESTADOS IMPORTANTES
  const [updatingPrice, setUpdatingPrice] = useState(false);
  const [publishing, setPublishing] = useState(false);
  // Lista de escuelas oficiales
const escuelas = [
  { value: "Escuela Cantabra de Surf Cantabria España", label: "Escuela Cantabra de Surf - Cantabria, España" },
  { value: "Somo's Beach Surf School Cantabria España", label: "Somo's Beach Surf School - Cantabria, España" },
  { value: "Sunset Cantabria España", label: "Sunset - Cantabria, España" },
  { value: "AWA Cantabria España", label: "AWA - Cantabria, España" },
  { value: "Xpeedin Cantabria España", label: "Xpeedin - Cantabria, España" },
  { value: "Northwind Cantabria España", label: "Northwind - Cantabria, España" },
  { value: "Pro Training Cantabria España", label: "Pro Training - Cantabria, España" },
  { value: "Latas Surfhouse Cantabria España", label: "Latas Surfhouse - Cantabria, España" },
  { value: "Surfinn Somo Cantabria España", label: "Surfinn Somo - Cantabria, España" },
  { value: "Koa Cantabria España", label: "Koa - Cantabria, España" },
  { value: "La Curva Cantabria España", label: "La Curva - Cantabria, España" },
  { value: "Mas Que Surf Cantabria España", label: "Mas Que Surf - Cantabria, España" },
  { value: "La isla de Santa Marina Cantabria España", label: "La Isla de Santa Marina - Cantabria, España" },
  { value: "Loredo Surf School Cantabria España", label: "Loredo Surf School - Cantabria, España" },
  { value: "Escuela de surf Molinucos Cantabria España", label: "Escuela de Surf Molinucos - Cantabria, España" },
  { value: "Obsession Surf School Cantabria España", label: "Obsession Surf School - Cantabria, España" },
  { value: "Surf to live Cantabria España", label: "Surf to Live - Cantabria, España" },
  { value: "Escuela de surf La Ola Cantabria España", label: "Escuela de Surf La Ola - Cantabria, España" },
  { value: "Langre Beach Cantabria España", label: "Langre Beach - Cantabria, España" },
  { value: "Escuela de surf El Sardinero Cantabria España", label: "Escuela de Surf El Sardinero - Cantabria, España" },
  { value: "Wayve Surf Cantabria España", label: "Wayve Surf - Cantabria, España" },
  { value: "Waves Sound Cantabria España", label: "Waves Sound - Cantabria, España" },
  { value: "Escuela de Surf Ris Cantabria España", label: "Escuela de Surf Ris - Cantabria, España" },
  { value: "HAND Surf School Cantabria España", label: "HAND Surf School - Cantabria, España" },
  { value: "Bear Surfschool Cantabria España", label: "Bear Surfschool - Cantabria, España" },
  { value: "Robayera Surf Experience Cantabria España", label: "Robayera Surf Experience - Cantabria, España" },
  { value: "Atlantic Surf School Cantabria España", label: "Atlantic Surf School - Cantabria, España" },
  { value: "Escuela de surf de Santander Cantabria España", label: "Escuela de Surf de Santander - Cantabria, España" },
  { value: "Bio Surfcamp Cantabria España", label: "Bio Surfcamp - Cantabria, España" },
  { value: "Escuela de surf Solar Cantabria España", label: "Escuela de Surf Solar - Cantabria, España" },
  { value: "Escuela de Surf ITA Cantabria España", label: "Escuela de Surf ITA - Cantabria, España" },
  { value: "Berria Surf School Cantabria España", label: "Berria Surf School - Cantabria, España" },
  { value: "Escuela de surf Liencres Cantabria España", label: "Escuela de Surf Liencres - Cantabria, España" },
  { value: "Totora Surf School Cantabria España", label: "Totora Surf School - Cantabria, España" },
  { value: "Escuela de Surf Suances Kangaroo Cantabria España", label: "Escuela de Surf Suances Kangaroo - Cantabria, España" },
  { value: "Surf Camp Ajo Natura Cantabria España", label: "Surf Camp Ajo Natura - Cantabria, España" },
  { value: "Watsay Surf School Cantabria España", label: "Watsay Surf School - Cantabria, España" },
  { value: "Escuela de Surf Los Locos Cantabria España", label: "Escuela de Surf Los Locos - Cantabria, España" },
  { value: "Buena Onda Cantabria España", label: "Buena Onda - Cantabria, España" },
  { value: "BM Surf School Cantabria España", label: "BM Surf School - Cantabria, España" },
  { value: "Escuela de Surf Pinos Laredo Cantabria España", label: "Escuela de Surf Pinos Laredo - Cantabria, España" },
  { value: "Escuela de Surf Meron Cantabria España", label: "Escuela de Surf Merón - Cantabria, España" },
  { value: "Oyambe Surf Cantabria España", label: "Oyambe Surf - Cantabria, España" },
  { value: "Waikiki Cantabria España", label: "Waikiki - Cantabria, España" },
  { value: "Islares Surf Camp Cantabria España", label: "Islares Surf Camp - Cantabria, España" },
  { value: "Nomad Cantabria España", label: "Nomad - Cantabria, España" },
  { value: "Enjoy SUP School Cantabria España", label: "Enjoy SUP School - Cantabria, España" },
  { value: "Escuela de Surf Mobile Cantabria España", label: "Escuela de Surf Mobile - Cantabria, España" },
  { value: "Apasionados Cantabria España", label: "Apasionados - Cantabria, España" },
  { value: "Escuela de Surf Arenillas Cantabria España", label: "Escuela de Surf Arenillas - Cantabria, España" },
  { value: "Black Shark Cantabria España", label: "Black Shark - Cantabria, España" },
  { value: "Surfadictos Cantabria España", label: "Surfadictos - Cantabria, España" },
  { value: "Wolfhouse Cantabria España", label: "Wolfhouse - Cantabria, España" },
  { value: "Salinas Surfschool Asturias España", label: "Salinas Surfschool - Asturias, España" },
  { value: "Escuela de Surf Blue Wave Asturias España", label: "Escuela de Surf Blue Wave - Asturias, España" },
  { value: "Surfastur Asturias España", label: "Surfastur - Asturias, España" },
  { value: "Llanes Surf School Asturias España", label: "Llanes Surf School - Asturias, España" },
  { value: "Salinas Surf Camp Asturias España", label: "Salinas Surf Camp - Asturias, España" },
  { value: "Rompiente Norte Asturias España", label: "Rompiente Norte - Asturias, España" },
  { value: "Escuela Asturiana de Surf Asturias España", label: "Escuela Asturiana de Surf - Asturias, España" },
  { value: "Longbeach Asturias España", label: "Longbeach - Asturias, España" },
  { value: "Tablas Surf School Asturias España", label: "Tablas Surf School - Asturias, España" },
  { value: "Surfcamp Ribadesella Asturias España", label: "Surfcamp Ribadesella - Asturias, España" },
  { value: "Family Surfers Surfcamp Asturias España", label: "Family Surfers Surfcamp - Asturias, España" },
  { value: "Fre Surf School Asturias España", label: "Fre Surf School - Asturias, España" },
  { value: "La Surferita Asturias España", label: "La Surferita - Asturias, España" },
  { value: "Marejada Asturias España", label: "Marejada - Asturias, España" },
  { value: "Lucas Garcia Surf Asturias España", label: "Lucas Garcia Surf - Asturias, España" },
  { value: "SkoolSurf Asturias España", label: "SkoolSurf - Asturias, España" },
  { value: "Lampariego Surf School Asturias España", label: "Lampariego Surf School - Asturias, España" },
  { value: "Vega Surf Academy Asturias España", label: "Vega Surf Academy - Asturias, España" },
  { value: "Horizon Escuela de Surf Asturias España", label: "Horizon Escuela de Surf - Asturias, España" },
  { value: "Alamar Salinas Asturias España", label: "Alamar Salinas - Asturias, España" },
  { value: "Pukas Peña Txuri Surf Escola Pais Vasco España", label: "Pukas Peña Txuri Surf Escola - País Vasco, España" },
  { value: "Mundaka Barra Surf Pais Vasco España", label: "Mundaka Barra Surf - País Vasco, España" },
  { value: "Gorka Yarritu Pais Vasco España", label: "Gorka Yarritu - País Vasco, España" },
  { value: "Kresala Surf Eskola Pais Vasco España", label: "Kresala Surf Eskola - País Vasco, España" },
  { value: "North Shore Surf Camp Pais Vasco España", label: "North Shore Surf Camp - País Vasco, España" },
  { value: "Flysch Surf Pais Vasco España", label: "Flysch Surf - País Vasco, España" },
  { value: "Barrika Surf Camp Pais Vasco España", label: "Barrika Surf Camp - País Vasco, España" },
  { value: "Zurriola Surf Eskola Pais Vasco España", label: "Zurriola Surf Eskola - País Vasco, España" },
  { value: "IPAR Surf eskola Pais Vasco España", label: "IPAR Surf Eskola - País Vasco, España" },
  { value: "Essus Surf Eskola Zarautz Pais Vasco España", label: "Essus Surf Eskola - Zarautz, País Vasco, España" },
  { value: "Good People Surf Pais Vasco España", label: "Good People Surf - País Vasco, España" },
  { value: "Escuela de Surf SPOT Pais Vasco España", label: "Escuela de Surf SPOT - País Vasco, España" },
  { value: "Escuela de Surf de Laga Pais Vasco España", label: "Escuela de Surf de Laga - País Vasco, España" },
  { value: "Acero Surf Eskola Pais Vasco España", label: "Acero Surf Eskola - País Vasco, España" },
  { value: "Uribe Kosta Surf Eskola Pais Vasco España", label: "Uribe Kosta Surf Eskola - País Vasco, España" },
  { value: "Surf Teknika Eskola Pais Vasco España", label: "Surf Teknika Eskola - País Vasco, España" },
  { value: "Groseko Indarra Surf Eskola-Taldea Pais Vasco España", label: "Groseko Indarra Surf Eskola - País Vasco, España" },
  { value: "Pukas Surf Eskola Zarautz Pais Vasco España", label: "Pukas Surf Eskola - Zarautz, País Vasco, España" },
  { value: "Moor Surf Eskola Pais Vasco España", label: "Moor Surf Eskola - País Vasco, España" },
  { value: "Bunker Pais Vasco España", label: "Bunker - País Vasco, España" },
  { value: "Escuela de Surf Zumaia Pais Vasco España", label: "Escuela de Surf Zumaia - País Vasco, España" },
  { value: "She Surfs Islas Canarias España", label: "She Surfs - Islas Canarias, España" },
  { value: "Friends of the ocean Islas Canarias España", label: "Friends of the Ocean - Islas Canarias, España" },
  { value: "Franz Surf School Islas Canarias España", label: "Franz Surf School - Islas Canarias, España" },
  { value: "Ika Ika Surf School Islas Canarias España", label: "Ika Ika Surf School - Islas Canarias, España" },
  { value: "Kontraola Surf School Islas Canarias España", label: "Kontraola Surf School - Islas Canarias, España" },
  { value: "Shaka Surf Tenerife Islas Canarias España", label: "Shaka Surf Tenerife - Islas Canarias, España" },
  { value: "Fins First Surf School Islas Canarias España", label: "Fins First Surf School - Islas Canarias, España" },
  { value: "Drop In Surf School Islas Canarias España", label: "Drop In Surf School - Islas Canarias, España" },
  { value: "Kaizen Surf School Islas Canarias España", label: "Kaizen Surf School - Islas Canarias, España" },
  { value: "Tilegit Islas Canarias España", label: "Tilegit - Islas Canarias, España" },
  { value: "Rocky Point Islas Canarias España", label: "Rocky Point - Islas Canarias, España" },
  { value: "Tenerife Surf Point Islas Canarias España", label: "Tenerife Surf Point - Islas Canarias, España" },
  { value: "Ocean Freaks World Islas Canarias España", label: "Ocean Freaks World - Islas Canarias, España" },
  { value: "Spartak Surf Coach Islas Canarias España", label: "Spartak Surf Coach - Islas Canarias, España" },
  { value: "K16 Surf School Islas Canarias España", label: "K16 Surf School - Islas Canarias, España" },
  { value: "Surf Life Tenerife Islas Canarias España", label: "Surf Life Tenerife - Islas Canarias, España" },
  { value: "Kite Hub Tenerife Islas Canarias España", label: "Kite Hub Tenerife - Islas Canarias, España" },
  { value: "Sognicanarias Watersports Islas Canarias España", label: "Sognicanarias Watersports - Islas Canarias, España" }
];
const playas = [
  { value: "Playa de Fuenterrabia - País Vasco España", label: "Playa de Fuenterrabia, País Vasco" },
  { value: "Playa de la Zurriola Zurriola País Vasco España", label: "Playa de la Zurriola,País Vasco" },
  { value: "Playa de la Concha La Concha País Vasco España", label: "Playa de la Concha, País Vasco" },
  { value: "Playa de Ondarreta Pikua Pikua País Vasco España", label: "Playa de Ondarreta, País Vasco" },
  { value: "Playa de Ondarreta Tenis Tenis País Vasco España", label: "Playa de Ondarreta, País Vasco" },
  { value: "Agiti Agiti País Vasco España", label: "Agiti, País Vasco" },
  { value: "Orio Orio País Vasco España", label: "Orio, País Vasco" },
  { value: "Zarautz Zarautz País Vasco España", label: "Zarautz, País Vasco" },
  { value: "Karramarro Karramarro País Vasco España", label: "Karramarro - Karramarro, País Vasco, España" },
  { value: "Playa de Gaztetape Gaztetape País Vasco España", label: "Playa de Gaztetape - Gaztetape, País Vasco, España" },
  { value: "Orrua (roca punta) Roca punta País Vasco España", label: "Orrua - Roca Punta, País Vasco, España" },
  { value: "Itzurun Itzurun País Vasco España", label: "Itzurun - Itzurun, País Vasco, España" },
  { value: "Playa de Deba Deba País Vasco España", label: "Playa de Deba - Deba, País Vasco, España" },
  { value: "Playa Alkolea Alkolea País Vasco España", label: "Playa Alkolea - Alkolea, País Vasco, España" },
  { value: "Playa de Karraspio Karraspio País Vasco España", label: "Playa de Karraspio - Karraspio, País Vasco, España" },
  { value: "Playa de Ogeia Ogeia País Vasco España", label: "Playa de Ogeia - Ogeia, País Vasco, España" },
  { value: "Playa de Laga Laga País Vasco España", label: "Playa de Laga - Laga, País Vasco, España" },
  { value: "Playa de Anzoras-Laila Anzoras - Laila País Vasco España", label: "Playa de Anzoras-Laila - Anzoras, País Vasco, España" },
  { value: "Mundaka Mundaka País Vasco España", label: "Mundaka - Mundaka, País Vasco, España" },
  { value: "Aritzatxu Aritzatxu País Vasco España", label: "Aritzatxu - Aritzatxu, País Vasco, España" },
  { value: "Playa de Bakio Bakio País Vasco España", label: "Playa de Bakio - Bakio, País Vasco, España" },
  { value: "Cala de Basordas Basordas País Vasco España", label: "Cala de Basordas - Basordas, País Vasco, España" },
  { value: "Playa de Plentzia Plentzia País Vasco España", label: "Playa de Plentzia - Plentzia, País Vasco, España" },
  { value: "Playa de Barrica Barrica País Vasco España", label: "Playa de Barrica - Barrica, País Vasco, España" },
  { value: "Cala Meñacoz Meñacoz País Vasco España", label: "Cala Meñacoz - Meñacoz, País Vasco, España" },
  { value: "Playa de Atxabirbil Atxabirbil País Vasco España", label: "Playa de Atxabirbil - Atxabirbil, País Vasco, España" },
  { value: "Playa de Arrietara Arrietara País Vasco España", label: "Playa de Arrietara - Arrietara, País Vasco, España" },
  { value: "Playa la Salvaje Salvaje País Vasco España", label: "Playa la Salvaje - Salvaje, País Vasco, España" },
  { value: "Playa de Azkorri Azkorri País Vasco España", label: "Playa de Azkorri - Azkorri, País Vasco, España" },
  { value: "Punta Galea Punta galea País Vasco España", label: "Punta Galea - Punta Galea, País Vasco, España" },
  { value: "Playa de Alcorta Alcorta País Vasco España", label: "Playa de Alcorta - Alcorta, País Vasco, España" },
  { value: "Playa de Ereaga Ereaga País Vasco España", label: "Playa de Ereaga - Ereaga, País Vasco, España" },
  { value: "Playa de la Arena La Arena País Vasco España", label: "Playa de la Arena - La Arena, País Vasco, España" },
  { value: "Playa de Brazomar Brazomar Cantabria España", label: "Playa de Brazomar - Brazomar, Cantabria, España" },
  { value: "Playa de Arenillas Arenillas Cantabria España", label: "Playa de Arenillas - Arenillas, Cantabria, España" },
  { value: "Playa de Oriñon Oriñon Cantabria España", label: "Playa de Oriñon - Oriñon, Cantabria, España" },
  { value: "Playa de San Julián San Julian Cantabria España", label: "Playa de San Julián - San Julián, Cantabria, España" },
  { value: "Playa de Laredo Laredo Cantabria España", label: "Playa de Laredo - Laredo, Cantabria, España" },
  { value: "La Fortaleza La Fortaleza Cantabria España", label: "La Fortaleza - La Fortaleza, Cantabria, España" },
  { value: "Playa de Berria Berria Cantabria España", label: "Playa de Berria - Berria, Cantabria, España" },
  { value: "Playa de Trengandin El Brusco Cantabria España", label: "Playa de Trengandin - El Brusco, Cantabria, España" },
  { value: "Playa de el Ris El Ris Cantabria España", label: "Playa de El Ris - El Ris, Cantabria, España" },
  { value: "Playa del Arenal (Cantabria) El Arenal Cantabria España", label: "Playa del Arenal - El Arenal, Cantabria, España" },
  { value: "Playa de Cuberris Cuberris Cantabria España", label: "Playa de Cuberris - Cuberris, Cantabria, España" },
  { value: "Playa de Antuerta Antuerta / Ajo Cantabria España", label: "Playa de Antuerta - Antuerta / Ajo, Cantabria, España" },
  { value: "Playa de Galizano Galizano Cantabria España", label: "Playa de Galizano - Galizano, Cantabria, España" },
  { value: "Playa de Langre Langre Cantabria España", label: "Playa de Langre - Langre, Cantabria, España" },
  { value: "Loredo Loredo Cantabria España", label: "Loredo - Loredo, Cantabria, España" },
  { value: "Isla Santa Marina Los Tranquilos Cantabria España", label: "Isla Santa Marina - Los Tranquilos, Cantabria, España" },
  { value: "Playa de Somo Somo Cantabria España", label: "Playa de Somo - Somo, Cantabria, España" },
  { value: "Playa del Camello Camello Cantabria España", label: "Playa del Camello - Camello, Cantabria, España" },
  { value: "Playa el Sardinero Sardinero Cantabria España", label: "Playa el Sardinero - Sardinero, Cantabria, España" },
  { value: "Playa de Canallave Canallave Cantabria España", label: "Playa de Canallave - Canallave, Cantabria, España" },
  { value: "Playa de Valdearenas Valdearenas Cantabria España", label: "Playa de Valdearenas - Valdearenas, Cantabria, España" },
  { value: "Playa de Robayera Robayera Cantabria España", label: "Playa de Robayera - Robayera, Cantabria, España" },
  { value: "Playa de Usgo Usgo Cantabria España", label: "Playa de Usgo - Usgo, Cantabria, España" },
  { value: "Playa de los Caballos Caballos Cantabria España", label: "Playa de los Caballos - Caballos, Cantabria, España" },
  { value: "Playa de la Concha La Concha Cantabria España", label: "Playa de la Concha - La Concha, Cantabria, España" },
  { value: "Los Locos Los Locos Cantabria España", label: "Los Locos - Los Locos, Cantabria, España" },
  { value: "Playa de la Tablia La Tablia Cantabria España", label: "Playa de la Tablia - La Tablia, Cantabria, España" },
  { value: "Playa el Sable El Sable Cantabria España", label: "Playa el Sable - El Sable, Cantabria, España" },
  { value: "Playa de Cóbreces Cobreces Cantabria España", label: "Playa de Cóbreces - Cobreces, Cantabria, España" },
  { value: "Playa de Oyambre Oyambre Cantabria España", label: "Playa de Oyambre - Oyambre, Cantabria, España" },
  { value: "Playa de Gerra San Vicente Cantabria España", label: "Playa de Gerra - San Vicente, Cantabria, España" },
  { value: "San vicente La Barquera San Vicente Cantabria España", label: "San Vicente La Barquera - San Vicente, Cantabria, España" },
  { value: "Playa de Merón Meron Cantabria España", label: "Playa de Merón - Merón, Cantabria, España" },
  { value: "Punta Liñera Liñera Cantabria España", label: "Punta Liñera - Liñera, Cantabria, España" },
  { value: "Playa de Mendía Mendia Asturias España", label: "Playa de Mendía - Mendia, Asturias, España" },
  { value: "Playa de Vidiago Vidiago Asturias España", label: "Playa de Vidiago - Vidiago, Asturias, España" },
  { value: "Playa de Andrín Andrin Asturias España", label: "Playa de Andrín - Andrín, Asturias, España" },
  { value: "Playa de Ballota Ballota Asturias España", label: "Playa de Ballota - Ballota, Asturias, España" },
  { value: "Playa de San Martin San Martin Asturias España", label: "Playa de San Martín - San Martín, Asturias, España" },
  { value: "Playa de Niembro Niembro Asturias España", label: "Playa de Niembro - Niembro, Asturias, España" },
  { value: "Playa de Torimbia Torimbia Asturias España", label: "Playa de Torimbia - Torimbia, Asturias, España" },
  { value: "Playa de San Antolín San Antolin Asturias España", label: "Playa de San Antolín - San Antolín, Asturias, España" },
  { value: "Playa de Santa Marina Santa Marina Asturias España", label: "Playa de Santa Marina - Santa Marina, Asturias, España" },
  { value: "Playa de Vega Vega Asturias España", label: "Playa de Vega - Vega, Asturias, España" },
  { value: "Playa Arenal de Moris Arenal de Moris Asturias España", label: "Playa Arenal de Moris - Arenal de Moris, Asturias, España" },
  { value: "Playa Espasa Espasa Asturias España", label: "Playa Espasa - Espasa, Asturias, España" },
  { value: "Playa de la Isla Playa La Isla Asturias España", label: "Playa de la Isla - La Isla, Asturias, España" },
  { value: "Playa de la Griega La Griega Asturias España", label: "Playa de la Griega - La Griega, Asturias, España" },
  { value: "Cabo Lastres Cabo Lastres Asturias España", label: "Cabo Lastres - Cabo Lastres, Asturias, España" },
  { value: "Ensenada de la Conejera Ensenada la conejera Asturias España", label: "Ensenada de la Conejera - Ensenada la Conejera, Asturias, España" },
  { value: "Playa de Rodiles Rodiles Asturias España", label: "Playa de Rodiles - Rodiles, Asturias, España" },
  { value: "Ría Rodiles Ria rodiles Asturias España", label: "Ría Rodiles - Ría Rodiles, Asturias, España" },
  { value: "Playa de Merón Meron Asturias España", label: "Playa de Merón - Merón, Asturias, España" },
  { value: "Playa de la Ñora La ñora Asturias España", label: "Playa de la Ñora - La Ñora, Asturias, España" },
  { value: "Playa de Peñarrubia Peñarrubia Asturias España", label: "Playa de Peñarrubia - Peñarrubia, Asturias, España" },
  { value: "Playa de Cervigón Cervigon Asturias España", label: "Playa de Cervigón - Cervigón, Asturias, España" },
  { value: "El Mongol El Mongol Asturias España", label: "El Mongol - El Mongol, Asturias, España" },
  { value: "La Rocala Roca Asturias España", label: "La Roca - La Roca, Asturias, España" },
  { value: "Playa de San Lorenzo San lorenzo Asturias España", label: "Playa de San Lorenzo - San Lorenzo, Asturias, España" },
  { value: "Playa de Poniente Poniente Asturias España", label: "Playa de Poniente - Poniente, Asturias, España" },
  { value: "Playa de Xivares Xivares Asturias España", label: "Playa de Xivares - Xivares, Asturias, España" },
  { value: "Playa del Tranqueru Tranqueru Asturias España", label: "Playa del Tranqueru - Tranqueru, Asturias, España" },
  { value: "Playa de Carranques Carranques Asturias España", label: "Playa de Carranques - Carranques, Asturias, España" },
  { value: "Playa de la Palmera La Palmera Asturias España", label: "Playa de la Palmera - La Palmera, Asturias, España" },
  { value: "La Llastra La Llastra Asturias España", label: "La Llastra - La Llastra, Asturias, España" },
  { value: "Playa de Luanco Luanco Asturias España", label: "Playa de Luanco - Luanco, Asturias, España" },
  { value: "Playa Bañuges Bañuges Asturias España", label: "Playa Bañuges - Bañuges, Asturias, España" },
  { value: "Playa de Tenrero Tenrero Asturias España", label: "Playa de Tenrero - Tenrero, Asturias, España" },
  { value: "Playa de Cerniciega Cerniciega Asturias España", label: "Playa de Cerniciega - Cerniciega, Asturias, España" },
  { value: "Playa Aguilera Aguilera Asturias España", label: "Playa Aguilera - Aguilera, Asturias, España" },
  { value: "Playa de Xagó Xago Asturias España", label: "Playa de Xagó - Xagó, Asturias, España" },
  { value: "El Faro El faro Asturias España", label: "El Faro - El Faro, Asturias, España" },
  { value: "Playa del Espartal Espartal Asturias España", label: "Playa del Espartal - Espartal, Asturias, España" },
  { value: "Playa de Salinas Salinas Asturias España", label: "Playa de Salinas - Salinas, Asturias, España" },
  { value: "Playa de Arnao Arnao Asturias España", label: "Playa de Arnao - Arnao, Asturias, España" },
  { value: "Playa Santa Maria del Mar Santa Maria del Mar Asturias España", label: "Playa Santa María del Mar - Santa María del Mar, Asturias, España" },
  { value: "Playa Bahinas Bahinas Asturias España", label: "Playa Bahinas - Bahinas, Asturias, España" },
  { value: "Playa de Bayas Bayas Asturias España", label: "Playa de Bayas - Bayas, Asturias, España" },
  { value: "Playa los Quebrantos Quebrantos Asturias España", label: "Playa los Quebrantos - Quebrantos, Asturias, España" },
  { value: "Playa Aguilar Aguilar Asturias España", label: "Playa Aguilar - Aguilar, Asturias, España" },
  { value: "Playa Concha de Artedo Concha de Artedo Asturias España", label: "Playa Concha de Artedo - Concha de Artedo, Asturias, España" },
  { value: "Playa De San Pedro San Pedro Asturias España", label: "Playa de San Pedro - San Pedro, Asturias, España" },
  { value: "Playa de Cadaveo Cadaveo Asturias España", label: "Playa de Cadaveo - Cadaveo, Asturias, España" },
  { value: "Playa de Cueva Cueva Asturias España", label: "Playa de Cueva - Cueva, Asturias, España" },
  { value: "Playa de Otur Otur Asturias España", label: "Playa de Otur - Otur, Asturias, España" },
  { value: "Playa de Barayo Barayo Asturias España", label: "Playa de Barayo - Barayo, Asturias, España" },
  { value: "Playa de Frexulfe Frexulfe Asturias España", label: "Playa de Frexulfe - Frexulfe, Asturias, España" },
  { value: "Playa de el Moro El Moro Asturias España", label: "Playa de El Moro - El Moro, Asturias, España" },
  { value: "Playa de Navia Navia Asturias España", label: "Playa de Navia - Navia, Asturias, España" },
  { value: "Playa de Porcia Porcia Asturias España", label: "Playa de Porcia - Porcia, Asturias, España" },
  { value: "Tapia de Casariego Casariego Asturias España", label: "Tapia de Casariego - Casariego, Asturias, España" },
  { value: "La Paloma La Paloma Asturias España", label: "La Paloma - La Paloma, Asturias, España" },
  { value: "Playa de Serantes Serantes Asturias España", label: "Playa de Serantes - Serantes, Asturias, España" },
  { value: "Playa de Santa Gadea Santa Gadea Asturias España", label: "Playa de Santa Gadea - Santa Gadea, Asturias, España" },
  { value: "Playa de Peñarronda Peñarronda Asturias España", label: "Playa de Peñarronda - Peñarronda, Asturias, España" },
  { value: "Puente de los Santos Los Santos Asturias España", label: "Puente de los Santos - Los Santos, Asturias, España" },
  { value: "Puerta de Rinlo Rinlo Galicia España", label: "Puerta de Rinlo - Rinlo, Galicia, España" },
  { value: "P.S Miguel de Reinante Miguel reinante Galicia España", label: "P.S Miguel de Reinante - Miguel Reinante, Galicia, España" },
  { value: "Playa de San Bartolo San bartolo Galicia España", label: "Playa de San Bartolo - San Bartolo, Galicia, España" },
  { value: "Ría Ria Galicia España", label: "Ría - Ría, Galicia, España" },
  { value: "Playa de Llas Llas Galicia España", label: "Playa de Llas - Llas, Galicia, España" },
  { value: "Playa de Pampillosa Pampillosa Galicia España", label: "Playa de Pampillosa - Pampillosa, Galicia, España" },
  { value: "Playa de Arelonga Arelonga Galicia España", label: "Playa de Arelonga - Arelonga, Galicia, España" },
  { value: "A Machacona Machacona Galicia España", label: "A Machacona - Machacona, Galicia, España" },
  { value: "Playa a Marosa Marosa Galicia España", label: "Playa a Marosa - Marosa, Galicia, España" },
  { value: "Sucastro Sucastro Galicia España", label: "Sucastro - Sucastro, Galicia, España" },
  { value: "Playa de Muiñelos Muiñelos Galicia España", label: "Playa de Muiñelos - Muiñelos, Galicia, España" },
  { value: "Playa de Esteiro Esteiro Galicia España", label: "Playa de Esteiro - Esteiro, Galicia, España" },
  { value: "Playa de San Román San Roman Galicia España", label: "Playa de San Román - San Román, Galicia, España" },
  { value: "Playa de Bares Bares Galicia España", label: "Playa de Bares - Bares, Galicia, España" },
  { value: "Playa Esteiro o Barqueiro Mañon Galicia España", label: "Playa Esteiro o Barqueiro - Mañón, Galicia, España" },
  { value: "Playa de Picón Picon Galicia España", label: "Playa de Picón - Picón, Galicia, España" },
  { value: "Playa de Sarrigal Sarrigal Galicia España", label: "Playa de Sarrigal - Sarrigal, Galicia, España" },
  { value: "Playa de Eirón Eiron Galicia España", label: "Playa de Eirón - Eirón, Galicia, España" },
  { value: "Playa de San Antón San anton Galicia España", label: "Playa de San Antón - San Antón, Galicia, España" },
  { value: "Playa de Cariño Cariño Galicia España", label: "Playa de Cariño - Cariño, Galicia, España" },
  { value: "Playa de Vilarrube Villaube Galicia España", label: "Playa de Vilarrube - Vilarrube, Galicia, España" },
  { value: "Playa de Baleo Baleo Galicia España", label: "Playa de Baleo - Baleo, Galicia, España" },
  { value: "Playa Pantín Pantin Galicia España", label: "Playa Pantín - Pantín, Galicia, España" },
  { value: "Playa de Frouxeira Frouxeira Galicia España", label: "Playa de Frouxeira - Frouxeira, Galicia, España" },
  { value: "Playa Cano Grande Cano grande Galicia España", label: "Playa Cano Grande - Cano Grande, Galicia, España" },
  { value: "Playa de Campelo Campelo Galicia España", label: "Playa de Campelo - Campelo, Galicia, España" },
  { value: "Playa de Casal Casal Galicia España", label: "Playa de Casal - Casal, Galicia, España" },
  { value: "Playa de Ponzos Ponzos Galicia España", label: "Playa de Ponzos - Ponzos, Galicia, España" },
  { value: "Playa de Santa Comba Santa comba Galicia España", label: "Playa de Santa Comba - Santa Comba, Galicia, España" },
  { value: "Playa de Esmelle Esmelle Galicia España", label: "Playa de Esmelle - Esmelle, Galicia, España" },
  { value: "Playa de Doniños Doñinos Galicia España", label: "Playa de Doniños - Doñinos, Galicia, España" },
  { value: "Playa de Chanteiro Chanteiro Galicia España", label: "Playa de Chanteiro - Chanteiro, Galicia, España" },
  { value: "Playa de Orzán Orzan Galicia España", label: "Playa de Orzán - Orzán, Galicia, España" },
  { value: "Playa de Sabón Sabon Galicia España", label: "Playa de Sabón - Sabón, Galicia, España" },
  { value: "Playa Caión Caion Galicia España", label: "Playa Caión - Caión, Galicia, España" },
  { value: "Playa de Baldaio Baldaio Galicia España", label: "Playa de Baldaio - Baldaio, Galicia, España" },
  { value: "Playa de Razo Razo Galicia España", label: "Playa de Razo - Razo, Galicia, España" },
  { value: "Playa de Malpica Malpica Galicia España", label: "Playa de Malpica - Malpica, Galicia, España" },
  { value: "Playa de Seaia Seaia Galicia España", label: "Playa de Seaia - Seaia, Galicia, España" },
  { value: "Playa de Seiruga Seiruga Galicia España", label: "Playa de Seiruga - Seiruga, Galicia, España" },
  { value: "Playa de Soesto Soesto Galicia España", label: "Playa de Soesto - Soesto, Galicia, España" },
  { value: "Playa de Nemiña Nemiña Galicia España", label: "Playa de Nemiña - Nemiña, Galicia, España" },
  { value: "Playa Do Rostro Rostro Galicia España", label: "Playa Do Rostro - Rostro, Galicia, España" },
  { value: "Playa Mar Do Fora Mar do fora Galicia España", label: "Playa Mar Do Fora - Mar do Fora, Galicia, España" },
  { value: "Playa de Carnota Carnota Galicia España", label: "Playa de Carnota - Carnota, Galicia, España" },
  { value: "Playa de Lariño Lariño Galicia España", label: "Playa de Lariño - Lariño, Galicia, España" },
  { value: "Playa de Louro Louro Galicia España", label: "Playa de Louro - Louro, Galicia, España" },
  { value: "Playa Aguieira Aguieira Galicia España", label: "Playa Aguieira - Aguieira, Galicia, España" },
  { value: "Playa de Cabeiro Cabeiro Galicia España", label: "Playa de Cabeiro - Cabeiro, Galicia, España" },
  { value: "Playa de Baroña Baroña Galicia España", label: "Playa de Baroña - Baroña, Galicia, España" },
  { value: "Playa de Queiruga Queiruga Galicia España", label: "Playa de Queiruga - Queiruga, Galicia, España" },
  { value: "Playa de Furnas Furnas Galicia España", label: "Playa de Furnas - Furnas, Galicia, España" },
  { value: "Playa de Portiños Portiños Galicia España", label: "Playa de Portiños - Portiños, Galicia, España" },
  { value: "Playa A Lanzada Lanzada Galicia España", label: "Playa A Lanzada - Lanzada, Galicia, España" },
  { value: "Playa de Montalvo Montalvo Galicia España", label: "Playa de Montalvo - Montalvo, Galicia, España" },
  { value: "Playa de Aguete Aguete Galicia España", label: "Playa de Aguete - Aguete, Galicia, España" },
  { value: "Playa de Patos Patos Galicia España", label: "Playa de Patos - Patos, Galicia, España" },
  { value: "Playa de Santa María de Oia Santa maria de Oia Galicia España", label: "Playa de Santa María de Oia - Santa María de Oia, Galicia, España" },
  { value: "Punta del Moral - Isla Canela Isla Canela Andalucía España", label: "Punta del Moral - Isla Canela, Andalucía, España" },
  { value: "Isla Cristina Isla Cristina Andalucía España", label: "Isla Cristina - Isla Cristina, Andalucía, España" },
  { value: "Punta Umbría Punta Umbria Andalucía España", label: "Punta Umbría - Punta Umbría, Andalucía, España" },
  { value: "Mazagón Mazagon Andalucía España", label: "Mazagón - Mazagón, Andalucía, España" },
  { value: "Matalascañas Matalascañas Andalucía España", label: "Matalascañas - Matalascañas, Andalucía, España" },
  { value: "El Coto El coto Andalucía España", label: "El Coto - El Coto, Andalucía, España" },
  { value: "Playa de Regla Regla Andalucía España", label: "Playa de Regla - Regla, Andalucía, España" },
  { value: "Playa de Tres Piedras Tres piedras Andalucía España", label: "Playa de Tres Piedras - Tres Piedras, Andalucía, España" },
  { value: "Cien Metros Cien Metros Andalucía España", label: "Cien Metros - Cien Metros, Andalucía, España" },
  { value: "Playa de la Ballena La ballena Andalucía España", label: "Playa de la Ballena - La Ballena, Andalucía, España" },
  { value: "Las Redes Las redes Andalucía España", label: "Las Redes - Las Redes, Andalucía, España" },
  { value: "La Muralla La Muralla Andalucía España", label: "La Muralla - La Muralla, Andalucía, España" },
  { value: "La Playita Cadiz Capital Andalucía España", label: "La Playita - Cádiz Capital, Andalucía, España" },
  { value: "Las Caracolas Playa de la Victoria Andalucía España", label: "Las Caracolas - Playa de la Victoria, Andalucía, España" },
  { value: "La Cabañita Playa de la Victoria Andalucía España", label: "La Cabañita - Playa de la Victoria, Andalucía, España" },
  { value: "Torregorda Torregorda Andalucía España", label: "Torregorda - Torregorda, Andalucía, España" },
  { value: "Playa Campo de Soto Campo de Soto Andalucía España", label: "Playa Campo de Soto - Campo de Soto, Andalucía, España" },
  { value: "Playa de la Barrosa Barrosa Andalucía España", label: "Playa de la Barrosa - Barrosa, Andalucía, España" },
  { value: "Roche Roche Andalucía España", label: "Roche - Roche, Andalucía, España" },
  { value: "Playa El Palmar El Palmar Andalucía España", label: "Playa El Palmar - El Palmar, Andalucía, España" },
  { value: "Playa de los Caños de Meca Caños de Meca Andalucía España", label: "Playa de los Caños de Meca - Caños de Meca, Andalucía, España" },
  { value: "Playa de Hierbabuena Hierbabuena Andalucía España", label: "Playa de Hierbabuena - Hierbabuena, Andalucía, España" },
  { value: "Zahara de los Atunes Zahara de los Atunes Andalucía España", label: "Zahara de los Atunes - Zahara de los Atunes, Andalucía, España" },
  { value: "Bunker del Hurricane Los Lances Andalucía España", label: "Bunker del Hurricane - Los Lances, Andalucía, España" },
  { value: "Camping Tarifa Los Lances Andalucía España", label: "Camping Tarifa - Los Lances, Andalucía, España" },
  { value: "El Millón Los Lances Andalucía España", label: "El Millón - Los Lances, Andalucía, España" },
  { value: "Río Jara Rio Jara Andalucía España", label: "Río Jara - Río Jara, Andalucía, España" },
  { value: "Balneario Tarifa Andalucía España", label: "Balneario - Tarifa, Andalucía, España" },
  { value: "Playa de Sotogrande Sotogrande Andalucía España", label: "Playa de Sotogrande - Sotogrande, Andalucía, España" },
  { value: "Cabo Pino Cabo Pino Andalucía España", label: "Cabo Pino - Cabo Pino, Andalucía, España" },
  { value: "Punta de Calaburra Faro Torreblanca Andalucía España", label: "Punta de Calaburra - Faro Torreblanca, Andalucía, España" },
  { value: "El Chino Puerto Deportivo Andalucía España", label: "El Chino - Puerto Deportivo, Andalucía, España" },
  { value: "Playa de Carvajal Parque Maritimo Rey de España Andalucía España", label: "Playa de Carvajal - Parque Marítimo, Andalucía, España" },
  { value: "Sunset Playa Arroyo de la Miel Andalucía España", label: "Sunset - Playa Arroyo de la Miel, Andalucía, España" },
  { value: "El Puerto Espigon del Puerto Andalucía España", label: "El Puerto - Espigón del Puerto, Andalucía, España" },
  { value: "Playa de la Carihuela Carihuela Andalucía España", label: "Playa de la Carihuela - Carihuela, Andalucía, España" },
  { value: "Playa San Julián Guadalamar Andalucía España", label: "Playa San Julián - Guadalamar, Andalucía, España" },
  { value: "La Misericordia Misericordia Andalucía España", label: "La Misericordia - Misericordia, Andalucía, España" },
  { value: "Playa de Malagueta Malagueta Andalucía España", label: "Playa de Malagueta - Malagueta, Andalucía, España" },
  { value: "Playa D.Candado Playa el Palo Andalucía España", label: "Playa D.Candado - Playa el Palo, Andalucía, España" },
  { value: "Rincon de la Victoria (La Virgen) La Virgen Andalucía España", label: "Rincón de la Victoria - La Virgen, Andalucía, España" },
  { value: "Playa Torre del Mar Río Velez Andalucía España", label: "Playa Torre del Mar - Río Velez, Andalucía, España" },
  { value: "Playa de Lagos Lagos Andalucía España", label: "Playa de Lagos - Lagos, Andalucía, España" },
  { value: "Playa de la Carchuna Carchuna Andalucía España", label: "Playa de la Carchuna - Carchuna, Andalucía, España" },
  { value: "Playa de Almerimar Almerimar Andalucía España", label: "Playa de Almerimar - Almerimar, Andalucía, España" },
  { value: "Pico de las Conchas Playa del Zapillo Andalucía España", label: "Pico de las Conchas - Playa del Zapillo, Andalucía, España" },
  { value: "Pico de la Pipa Playa del Zapillo Andalucía España", label: "Pico de la Pipa - Playa del Zapillo, Andalucía, España" },
  { value: "Pico Punta del Rio Rio Andarax Andalucía España", label: "Pico Punta del Río - Río Andarax, Andalucía, España" },
  { value: "Max Point Aguilas Murcia España", label: "Max Point - Águilas, Murcia, España" },
  { value: "Playa Piojo Piojo Murcia España", label: "Playa Piojo - Piojo, Murcia, España" },
  { value: "Playa Percheles Percheles Murcia España", label: "Playa Percheles - Percheles, Murcia, España" },
  { value: "Playa Grande Playa grande Murcia España", label: "Playa Grande - Playa Grande, Murcia, España" },
  { value: "Playa Bahia Playa Bahia Murcia España", label: "Playa Bahía - Playa Bahía, Murcia, España" },
  { value: "La Mojonera Rambla de Valdentisco Murcia España", label: "La Mojonera - Rambla de Valdentisco, Murcia, España" },
  { value: "Playa de Calblanque Calblanque Murcia España", label: "Playa de Calblanque - Calblanque, Murcia, España" },
  { value: "Playa el Cañonero Cañonero Murcia España", label: "Playa el Cañonero - Cañonero, Murcia, España" },
  { value: "Playa de Levante (Murcia) Levante Murcia España", label: "Playa de Levante - Levante, Murcia, España" },
  { value: "Playa de Entremares Amolderas Murcia España", label: "Playa de Entremares - Amolderas, Murcia, España" },
  { value: "Playa de Galua Escollo de la Raja Murcia España", label: "Playa de Galua - Escollo de la Raja, Murcia, España" },
  { value: "Playa la Columna Playa galúa Murcia España", label: "Playa la Columna - Playa Galúa, Murcia, España" },
  { value: "Punta de la Raja Escollo de la Raja Murcia España", label: "Punta de la Raja - Escollo de la Raja, Murcia, España" },
  { value: "Calas de Santa Pola Este Santa Pola Valencia España", label: "Calas de Santa Pola - Santa Pola, Valencia, España" },
  { value: "Playa de el Alted Alted Valencia España", label: "Playa de El Alted - Alted, Valencia, España" },
  { value: "La Punta Cabo de Huertas Valencia España", label: "La Punta - Cabo de Huertas, Valencia, España" },
  { value: "La Placa Cabo de Huertas Valencia España", label: "La Placa - Cabo de Huertas, Valencia, España" },
  { value: "La Calita Cabo de Huertas Valencia España", label: "La Calita - Cabo de Huertas, Valencia, España" },
  { value: "Playa de San Juan San Juan Valencia España", label: "Playa de San Juan - San Juan, Valencia, España" },
  { value: "Playa Centro San Juan Valencia España", label: "Playa Centro - San Juan, Valencia, España" },
  { value: "Playa Finestrat Finestrat Valencia España", label: "Playa Finestrat - Finestrat, Valencia, España" },
  { value: "Playa de Levante (Valencia) Levante Valencia España", label: "Playa de Levante - Levante, Valencia, España" },
  { value: "Playa del Arenal (Valencia) El Arenal Valencia España", label: "Playa del Arenal - El Arenal, Valencia, España" },
  { value: "La Punta del Arenal Punta del Arenal Valencia España", label: "La Punta del Arenal - Punta del Arenal, Valencia, España" },
  { value: "Playa Montañart Montañart Valencia España", label: "Playa Montañart - Montañart, Valencia, España" },
  { value: "Júcar Jucar Valencia España", label: "Júcar - Júcar, Valencia, España" },
  { value: "Playa de San Antonio Bahia de Cullera Valencia España", label: "Playa de San Antonio - Bahía de Cullera, Valencia, España" },
  { value: "Playa de Dosel Dosel Valencia España", label: "Playa de Dosel - Dosel, Valencia, España" },
  { value: "El Chivas Puerto de Perello Valencia España", label: "El Chivas - Puerto de Perello, Valencia, España" },
  { value: "El Perellonet Perellonet Valencia España", label: "El Perellonet - Perellonet, Valencia, España" },
  { value: "Playa del Saler Saler Valencia España", label: "Playa del Saler - Saler, Valencia, España" },
  { value: "Playa de Malvarrosa Las Arenas Valencia España", label: "Playa de Malvarrosa - Las Arenas, Valencia, España" },
  { value: "Playa de Port Saplaya Saplaya Valencia España", label: "Playa de Port Saplaya - Saplaya, Valencia, España" },
  { value: "El Rock - Puebla Farnals Farnals Valencia España", label: "El Rock - Puebla Farnals, Valencia, España" },
  { value: "Playa del Puerto de Sagunto Puerto Sagunto Valencia España", label: "Playa del Puerto de Sagunto - Puerto Sagunto, Valencia, España" },
  { value: "Playa del Pinar Playa Del Pinar Valencia España", label: "Playa del Pinar - Playa del Pinar, Valencia, España" },
  { value: "Benicàssim Benicassim Valencia España", label: "Benicàssim - Benicàssim, Valencia, España" },
  { value: "Playa de Voramar Voramar Valencia España", label: "Playa de Voramar - Voramar, Valencia, España" },
  { value: "Port de Torredembarra Torredembarra Cataluña España", label: "Port de Torredembarra - Torredembarra, Cataluña, España" },
  { value: "Roc de Sant Gaietà Sant Gaieta Cataluña España", label: "Roc de Sant Gaietà - Sant Gaietà, Cataluña, España" },
  { value: "Port de Segur Segur Cataluña España", label: "Port de Segur - Segur, Cataluña, España" },
  { value: "Playa Ribes Roges Ribes Roges Cataluña España", label: "Playa Ribes Roges - Ribes Roges, Cataluña, España" },
  { value: "Playa de Sitges Sitges Cataluña España", label: "Playa de Sitges - Sitges, Cataluña, España" },
  { value: "Playa de Aiguadolç Aiguadolc Cataluña España", label: "Playa de Aiguadolç - Aiguadolç, Cataluña, España" },
  { value: "Playa de Ginesta Ginesta Cataluña España", label: "Playa de Ginesta - Ginesta, Cataluña, España" },
  { value: "Playa de les Botigues Botigues Cataluña España", label: "Playa de les Botigues - Botigues, Cataluña, España" },
  { value: "Playa de Sant Sebastià Sant Sebastia Cataluña España", label: "Playa de Sant Sebastià - Sant Sebastià, Cataluña, España" },
  { value: "Playa de la Barceloneta La Barceloneta Cataluña España", label: "Playa de la Barceloneta - La Barceloneta, Cataluña, España" },
  { value: "Playa del Bogatell Bogatell Cataluña España", label: "Playa del Bogatell - Bogatell, Cataluña, España" },
  { value: "Playa Nova Mar Bella Mar Bella Cataluña España", label: "Playa Nova Mar Bella - Mar Bella, Cataluña, España" },
  { value: "Playas del Manresá Manresa Cataluña España", label: "Playas del Manresá - Manresa, Cataluña, España" },
  { value: "Playa de Mongat Mongat Cataluña España", label: "Playa de Mongat - Mongat, Cataluña, España" },
  { value: "La Rotonda Rotonda Cataluña España", label: "La Rotonda - Rotonda, Cataluña, España" },
  { value: "Playa el Masnou Masnou Cataluña España", label: "Playa el Masnou - Masnou, Cataluña, España" },
  { value: "Playa de Premiá Premia Cataluña España", label: "Playa de Premiá - Premiá, Cataluña, España" },
  { value: "Pico del Tordera Tordera Cataluña España", label: "Pico del Tordera - Tordera, Cataluña, España" },
  { value: "Playa de Canyamel Canyamell Baleares España", label: "Playa de Canyamel - Canyamel, Baleares, España" },
  { value: "Playa de Son Moll Son Moll Baleares España", label: "Playa de Son Moll - Son Moll, Baleares, España" },
  { value: "Cala Mesquida Mesquida Baleares España", label: "Cala Mesquida - Mesquida, Baleares, España" },
  { value: "El Bunker Bunker Baleares España", label: "El Bunker - Bunker, Baleares, España" },
  { value: "El Puerto Comercial El puerto Baleares España", label: "El Puerto Comercial - El Puerto, Baleares, España" },
  { value: "Playa de Peguera Peguera Baleares España", label: "Playa de Peguera - Peguera, Baleares, España" },
  { value: "Portals Vells Portal Vells Baleares España", label: "Portals Vells - Portal Vells, Baleares, España" },
  { value: "Playa de Cala Mayor Cala Mayor Baleares España", label: "Playa de Cala Mayor - Cala Mayor, Baleares, España" },
  { value: "Ciudad Jardin Ciudad Jardin Baleares España", label: "Ciudad Jardín - Ciudad Jardín, Baleares, España" },
  { value: "Cala Nova Cala Nova Baleares España", label: "Cala Nova - Cala Nova, Baleares, España" },
  { value: "Cala Llenya Cala Llenya Baleares España", label: "Cala Llenya - Cala Llenya, Baleares, España" },
  { value: "Playa Aguas Blancas Aguas Blancas Baleares España", label: "Playa Aguas Blancas - Aguas Blancas, Baleares, España" },
  { value: "Confusion Confusion Baleares España", label: "Confusion - Confusion, Baleares, España" },
  { value: "Can Pujols Pujols Baleares España", label: "Can Pujols - Pujols, Baleares, España" },
  { value: "Cala Jondal Jondal Baleares España", label: "Cala Jondal - Jondal, Baleares, España" },
  { value: "Playa de las Salinas Las Salinas Baleares España", label: "Playa de las Salinas - Las Salinas, Baleares, España" },
  { value: "Sa Punta Sa Punta Baleares España", label: "Sa Punta - Sa Punta, Baleares, España" },
  { value: "Playa de Migjorn Migjorn Baleares España", label: "Playa de Migjorn - Migjorn, Baleares, España" },
  { value: "Pico Cavalleria Cavalleria Baleares España", label: "Pico Cavalleria - Cavalleria, Baleares, España" },
  { value: "Cala D'Algaierens Algaierens Baleares España", label: "Cala D'Algaierens - Algaierens, Baleares, España" },
  { value: "Playa de Sant Tomás Sant Tomas Baleares España", label: "Playa de Sant Tomás - Sant Tomás, Baleares, España" },
  { value: "El Cartel El Cartel Canarias España", label: "El Cartel - El Cartel, Canarias, España" },
  { value: "Jameos del Agua Jameos del Agua Canarias España", label: "Jameos del Agua - Jameos del Agua, Canarias, España" },
  { value: "Caleta del Mero El Mero Canarias España", label: "Caleta del Mero - El Mero, Canarias, España" },
  { value: "Playa de la Canteria La Canteria Canarias España", label: "Playa de la Canteria - La Canteria, Canarias, España" },
  { value: "La Graciosa La Graciosa Canarias España", label: "La Graciosa - La Graciosa, Canarias, España" },
  { value: "La Playa Famara Famara Canarias España", label: "La Playa Famara - Famara, Canarias, España" },
  { value: "El Muelle Famara Canarias España", label: "El Muelle - Famara, Canarias, España" },
  { value: "San Juan Famara Canarias España", label: "San Juan - Famara, Canarias, España" },
  { value: "Caleta Caballo Caleta Caballo Canarias España", label: "Caleta Caballo - Caleta Caballo, Canarias, España" },
  { value: "El Complejo El Complejo Canarias España", label: "El Complejo - El Complejo, Canarias, España" },
  { value: "La Santa La Santa Canarias España", label: "La Santa - La Santa, Canarias, España" },
  { value: "El Quemao El Quemao Canarias España", label: "El Quemao - El Quemao, Canarias, España" },
  { value: "Playa del Ingles Playa del Ingles Canarias España", label: "Playa del Inglés - Playa del Inglés, Canarias, España" },
  { value: "Playa de las Burras Las Burras Canarias España", label: "Playa de las Burras - Las Burras, Canarias, España" },
  { value: "Playa de Tarajillo Tarajillo Canarias España", label: "Playa de Tarajillo - Tarajillo, Canarias, España" },
  { value: "El Castillo del Romeral El Romeral Canarias España", label: "El Castillo del Romeral - El Romeral, Canarias, España" },
  { value: "Punta de Tenefe Tenefe Canarias España", label: "Punta de Tenefe - Tenefe, Canarias, España" },
  { value: "Playa del Pozo Izquierdo Pozo Izquierdo Canarias España", label: "Playa del Pozo Izquierdo - Pozo Izquierdo, Canarias, España" },
  { value: "Mosca Point Bahia de Formas / Mosca Canarias España", label: "Mosca Point - Bahía de Formas, Canarias, España" },
  { value: "Playa de Arinaga Arinaga Canarias España", label: "Playa de Arinaga - Arinaga, Canarias, España" },
  { value: "El Muelle Viejo Muelle Viejo Canarias España", label: "El Muelle Viejo - Muelle Viejo, Canarias, España" },
  { value: "Playa de Melenara Melenara Canarias España", label: "Playa de Melenara - Melenara, Canarias, España" },
  { value: "Playa del Hombre El Hombre Canarias España", label: "Playa del Hombre - El Hombre, Canarias, España" },
  { value: "Playa de San Borondon San Borondon Canarias España", label: "Playa de San Borondón - San Borondón, Canarias, España" },
  { value: "Pico de la Laja La Laja Canarias España", label: "Pico de la Laja - La Laja, Canarias, España" },
  { value: "Las Monjas San Cristobal Canarias España", label: "Las Monjas - San Cristóbal, Canarias, España" },
  { value: "La Punta San Cristobal Canarias España", label: "La Punta - San Cristóbal, Canarias, España" },
  { value: "El Confital San Cristobal Canarias España", label: "El Confital - San Cristóbal, Canarias, España" },
  { value: "La Puntilla Playa de las Canteras Canarias España", label: "La Puntilla - Playa de las Canteras, Canarias, España" },
  { value: "La Cicer Playa de las Canteras Canarias España", label: "La Cicer - Playa de las Canteras, Canarias, España" },
  { value: "El Lloret Playa de las Canteras Canarias España", label: "El Lloret - Playa de las Canteras, Canarias, España" },
  { value: "Quintanilla Quintanilla Canarias España", label: "Quintanilla - Quintanilla, Canarias, España" },
  { value: "Pico de Boquines La Caleta Canarias España", label: "Pico de Boquines - La Caleta, Canarias, España" },
  { value: "El Picacho La Caleta Canarias España", label: "El Picacho - La Caleta, Canarias, España" },
  { value: "Pico de El Alto El Altillo Canarias España", label: "Pico de El Alto - El Altillo, Canarias, España" },
  { value: "Soledad El Pagador Canarias España", label: "Soledad - El Pagador, Canarias, España" },
  { value: "El Circo El Circo / Playa de San Felipe Canarias España", label: "El Circo - Playa de San Felipe, Canarias, España" },
  { value: "El Fronton Caleta de arriba Canarias España", label: "El Frontón - Caleta de Arriba, Canarias, España" },
  { value: "La Guancha Playa del Agujero Canarias España", label: "La Guancha - Playa del Agujero, Canarias, España" },
  { value: "El Agujero Playa del Agujero Canarias España", label: "El Agujero - Playa del Agujero, Canarias, España" },
  { value: "Playa de Bocabarranco Bocabarranco Canarias España", label: "Playa de Bocabarranco - Bocabarranco, Canarias, España" },
  { value: "Playa de la Aldea La Aldea Canarias España", label: "Playa de la Aldea - La Aldea, Canarias, España" },
  { value: "Playa de Tauro Punta del Tablero Canarias España", label: "Playa de Tauro - Punta del Tablero, Canarias, España" },
  { value: "Playa de Arguineguín Arguineguin Canarias España", label: "Playa de Arguineguín - Arguineguín, Canarias, España" },
  { value: "El Callao El Callao Canarias España", label: "El Callao - El Callao, Canarias, España" },
  { value: "El Charco Bajamar Canarias España", label: "El Charco - Bajamar, Canarias, España" },
  { value: "El Ancon El Ancon Canarias España", label: "El Ancón - El Ancón, Canarias, España" },
  { value: "Los Patos Los Patos Canarias España", label: "Los Patos - Los Patos, Canarias, España" },
  { value: "Playa El Socorro El Socorro Canarias España", label: "Playa El Socorro - El Socorro, Canarias, España" },
  { value: "La Caleta La Caleta Canarias España", label: "La Caleta - La Caleta, Canarias, España" },
  { value: "Playa de Las Conchas Las Conchas Canarias España", label: "Playa de Las Conchas - Las Conchas, Canarias, España" },
  { value: "Punta Blanca Punta Blanca Canarias España", label: "Punta Blanca - Punta Blanca, Canarias, España" },
  { value: "Las Palmeras Las Americas Canarias España", label: "Las Palmeras - Las Américas, Canarias, España" },
  { value: "El Conquistador Las Americas Canarias España", label: "El Conquistador - Las Américas, Canarias, España" },
  { value: "La izquierda Las Americas Canarias España", label: "La Izquierda - Las Américas, Canarias, España" },
  { value: "El Dedo Las Americas Canarias España", label: "El Dedo - Las Américas, Canarias, España" },
  { value: "La Fitenia Fitenia Canarias España", label: "La Fitenia - Fitenia, Canarias, España" },
  { value: "Playa de las Galletas Las Galletas Canarias España", label: "Playa de las Galletas - Las Galletas, Canarias, España" },
  { value: "Playa de la Tejita La Tejita Canarias España", label: "Playa de la Tejita - La Tejita, Canarias, España" },
  { value: "La Machacona Machacona Canarias España", label: "La Machacona - Machacona, Canarias, España" },
  { value: "Porís de Abona Porís de Abona Canarias España", label: "Porís de Abona - Porís de Abona, Canarias, España" },
  { value: "Igueste de San Andres San Andres Canarias España", label: "Igueste de San Andrés - San Andrés, Canarias, España" },
  { value: "Burro Burro Canarias España", label: "Burro - Burro, Canarias, España" },
  { value: "Punta Elena Punta Elena Canarias España", label: "Punta Elena - Punta Elena, Canarias, España" },
  { value: "El Medio (Fuerteventura) El Medio Canarias España", label: "El Medio - El Medio, Canarias, España" },
  { value: "El Muelle Punta las Tortugas Canarias España", label: "El Muelle - Punta las Tortugas, Canarias, España" },
  { value: "Isla de Lobos Lobos Canarias España", label: "Isla de Lobos - Lobos, Canarias, España" },
  { value: "Bristol Corralejo Canarias España", label: "Bristol - Corralejo, Canarias, España" },
  { value: "La Generosa La generosa Canarias España", label: "La Generosa - La Generosa, Canarias, España" },
  { value: "La Mejillonera Punta tiñosa / Mejillonera Canarias España", label: "La Mejillonera - Punta Tiñosa, Canarias, España" },
  { value: "El Hierro Punta las Tortugas Canarias España", label: "El Hierro - Punta las Tortugas, Canarias, España" },
  { value: "Derecha del Muelle El Cotillo Canarias España", label: "Derecha del Muelle - El Cotillo, Canarias, España" },
  { value: "Playa de el Cotillo El Cotillo Canarias España", label: "Playa de El Cotillo - El Cotillo, Canarias, España" },
  { value: "Playa La Pared Playa del Viejo Rey Canarias España", label: "Playa La Pared - Playa del Viejo Rey, Canarias, España" },
  { value: "Playa de Cofete Cofete Canarias España", label: "Playa de Cofete - Cofete, Canarias, España" },
  { value: "Playa de Butihondo Butihondo Canarias España", label: "Playa de Butihondo - Butihondo, Canarias, España" },
  { value: "Cruz Roja - Jandía Jandía Canarias España", label: "Cruz Roja - Jandía, Canarias, España" }
];
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [showBeachDropdown, setShowBeachDropdown] = useState(false);
// Cargar catálogo de packs
useEffect(() => {
  const loadPacks = async () => {
    if (!token) return;
    setIsLoadingPacks(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/v1/photo-sessions/packs/catalog`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setPacksCatalog(data);
    } catch (err) {
      console.error("Error cargando packs:", err);
    } finally {
      setIsLoadingPacks(false);
    }
  };

  loadPacks();
}, [token]);
// ====================== PUBLICAR SESIÓN ======================
const handlePublishSession = async () => {
  if (!sessionId) {
    alert("No se encontró el ID de la sesión");
    return;
  }
  if (formData.basePrice <= 0) {
    alert("Configurá un precio por foto mayor a cero");
    setStep(3);
    return;
  }
  if (uploadedImages.length === 0) {
    alert("Debes subir al menos una foto");
    setStep(2);
    return;
  }

  setShowPublishModal(true);   // ← Abre el modal en vez de publicar directamente
};

const confirmPublish = async () => {
  setShowPublishModal(false);
  setPublishing(true);

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${API_URL}/api/v1/photo-sessions/${sessionId}/publish`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (res.ok) {
      setShowSuccessModal(true);     // ← Abre el modal bonito
      // Ya NO usamos alert ni router.push aquí
    } else {
      const data = await res.json();
      alert(data.message || 'Error al publicar');
    }
  } catch (err) {
    alert('Error de conexión');
  } finally {
    setPublishing(false);
  }
};
// ====================== CREAR SESIÓN ======================
const handleCreateSession = async () => {
  if (!formData.date || !formData.startTime || !formData.endTime) {
    alert("Por favor completa la fecha y horarios");
    return;
  }

  // === DEBUG TOKEN ===
  console.log("🔑 DEBUG TOKEN EN CREATE SESSION:");
  console.log("→ Token actual:", token ? token.substring(0, 60) + "..." : "NULL / UNDEFINED");
  console.log("→ Longitud del token:", token?.length || 0);

  if (!token) {
    alert("No tienes sesión activa. Inicia sesión nuevamente.");
    router.push('/login');
    return;
  }

  setCreatingSession(true);

  const audience = formData.type === 'free-surfers' ? 'FREE_SURFERS' : 'SCHOOLS';

  const payload = {
    audience,
    location: formData.type === 'free-surfers' ? formData.location : null,
    schoolName: formData.type === 'escuelas' ? formData.school : null,
    sessionDate: formData.date,
    startTime: formData.startTime,
    endTime: formData.endTime,
  };

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${API_URL}/api/v1/photo-sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    console.log("→ Respuesta del servidor:", data);

    if (res.ok) {
      setSessionId(data.id);
    
      setStep(2);
    } else {
      alert(data.message || 'Error al crear la sesión');
      if (data.message?.toLowerCase().includes("token") || res.status === 401) {
        alert("Tu sesión expiró. Inicia sesión nuevamente.");
        logout();
        router.push('/login');
      }
    }
  } catch (err) {
    console.error("Error creando sesión:", err);
    alert('Error de conexión con el servidor');
  } finally {
    setCreatingSession(false);
  }
};


useEffect(() => {
    if (loading) return;
    if (!token) {
      logout();
      router.replace('/login');
    }
  }, [token, logout, router, loading]);

const updateForm = (field, value) => {
  setFormData(prev => {
    let newValue = value;

    if (field === 'basePrice') {
      newValue = parseFloat(value) || 0;
    }

    console.log(`🔄 updateForm → ${field} = ${newValue}`); // ← debug importante

    return { ...prev, [field]: newValue };
  });
};

  // ==================== MANEJO DE FOTOS ====================
  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    setPhotos(prev => [...prev, ...validFiles]);
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

const handleUploadPhotos = async () => {
  if (!sessionId) {
    alert("Primero crea la sesión en el Paso 1");
    return;
  }
  if (photos.length === 0) {
    alert("Selecciona al menos una foto");
    return;
  }

  setUploading(true);

  const formData = new FormData();
  photos.forEach((photo, i) => {
    formData.append('files', photo);
  });

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const url = `${API_URL}/api/v1/photo-sessions/${sessionId}/images`;

    console.log("🔍 DEBUG UPLOAD:");
    console.log("→ API_URL:", API_URL);
    console.log("→ URL completa:", url);
    console.log("→ Token existe:", !!token);
    console.log("→ Cantidad de fotos:", photos.length);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    console.log("→ Status:", res.status, res.statusText);

    let data;
    try {
      data = await res.json();
    } catch (e) {
      data = { message: await res.text() || "No se pudo leer la respuesta" };
    }

    console.log("→ Respuesta del servidor:", data);

   if (res.ok) {
 
  setUploadedImages(data.images || []);
  setPhotos([]);           // Limpiamos las pendientes
} else {
  alert(data.message || 'Error al subir las fotos');
}
  } catch (err) {
    console.error("❌ Error completo:", err);
    alert(`Error de conexión.\n\nRevisa la consola (F12) y dime qué ves.`);
  } finally {
    setUploading(false);
  }
};
// ====================== ACTUALIZAR PRECIO + PACKS ======================
const handleUpdatePricing = async () => {
  if (!sessionId) {
    alert("Sesión no encontrada");
    return;
  }

  if (formData.basePrice < 1) {
    alert("El precio debe ser mayor a 1 €");
    return;
  }

  setUpdatingPrice(true);

  const packsPayload = formData.selectedPacks.map(id => ({
    packId: id,
    enabled: true
  }));

  const payload = {
    unitPricePhotographerEur: formData.basePrice,   // ← ESTE ES EL CAMBIO CLAVE
    packs: packsPayload
  };

  console.log("📤 Enviando PATCH:", payload);

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${API_URL}/api/v1/photo-sessions/${sessionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("📥 Respuesta del servidor:", data);

    if (res.ok) {
      // Actualizamos el precio local con lo que devuelve el backend
      const serverPrice = data?.pricing?.unitPricePhotographerEur;
      if (serverPrice) {
        setFormData(prev => ({ ...prev, basePrice: serverPrice }));
      }

      
      setStep(4);
    } else {
      alert(data.message || 'Error al guardar precio');
    }
  } catch (err) {
    console.error(err);
    alert('Error de conexión');
  } finally {
    setUpdatingPrice(false);
  }
};
// Función para cerrar éxito e ir a mis sesiones
  const handleGoToMySessions = () => {
    setShowSuccessModal(false);
    router.push('/shot/misSesiones');
  };
// ====================== ACTUALIZAR PACKS ======================
// ====================== ACTUALIZAR PACKS ======================
// ====================== ACTUALIZAR PACKS ======================
const handleUpdatePacks = async () => {
  if (!sessionId) {
    alert("Primero crea la sesión");
    return;
  }

  if (formData.selectedPacks.length === 0) {
    alert("Selecciona al menos un pack");
    return;
  }

  const packsPayload = formData.selectedPacks.map(id => ({
    packId: id,
    enabled: true
  }));

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const url = `${API_URL}/api/v1/photo-sessions/${sessionId}`;

    console.log("🔄 Enviando packs a:", url);
    console.log("📦 Payload:", { packs: packsPayload });

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ packs: packsPayload }),
    });

    console.log("→ Status:", res.status, res.statusText);

    let data;
    try {
      data = await res.json();
    } catch (e) {
      data = { message: await res.text() || "Sin mensaje del servidor" };
    }

    console.log("→ Respuesta completa:", data);

    if (res.ok) {
      alert('✅ Packs guardados correctamente');
    } else {
      alert(data.message || `Error ${res.status} - Revisa la consola`);
    }
  } catch (err) {
    console.error("❌ Error en handleUpdatePacks:", err);
    alert("Error de conexión. Revisa la consola (F12).");
  }
};
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e) => handleFiles(e.target.files);

const handleNext = async () => {
  if (step === 1) {
    await handleCreateSession();
  } 
  else if (step === 2) {
    if (photos.length > 0) {
      await handleUploadPhotos();
    }
    setStep(3);
  } 
  else if (step === 3) {
    await handleUpdatePricing();
  } 
  else if (step === 4) {
    await handlePublishSession();   // ← Ahora publica aquí
  }
};

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }
const togglePack = (packId) => {
  setFormData(prev => ({
    ...prev,
    selectedPacks: prev.selectedPacks.includes(packId)
      ? prev.selectedPacks.filter(id => id !== packId)
      : [...prev.selectedPacks, packId]
  }));
};

const commissionRate = 0.25;
const finalPrice = (formData.basePrice * (1 - commissionRate)).toFixed(2);
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-gray-600">
          <span>Mis sesiones</span>
          <span>›</span>
          <span className="font-medium text-gray-900">Nueva sesión</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Nuevo álbum</h1>

        {/* Stepper Mejorado - Con tick azul */}
<div className="flex justify-center mb-10">
  <div className="flex items-center">
    {[
      { label: 'Detalles', icon: '/icons/details.svg', activeIcon: '/icons/details-active.svg' },
      { label: 'Fotos',    icon: '/icons/photos.svg',    activeIcon: '/icons/photos-active.svg' },
      { label: 'Precios',  icon: '/icons/prices.svg',  activeIcon: '/icons/prices-active.svg' },
      { label: 'Confirmación', icon: '/icons/confirm.svg', activeIcon: '/icons/confirm-active.svg' },
    ].map((stepInfo, index) => {
      const isCompleted = step > index + 1;
      const isCurrent = step === index + 1;

      return (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                isCompleted
                  ? 'bg-[#106BB9] border-[#106BB9]'     // Círculo azul completo
                  : isCurrent
                  ? 'border-[#106BB9] bg-white'        // Paso actual
                  : 'border-gray-300 bg-white'        // Paso futuro
              }`}
            >
             {isCompleted ? (
                <img
                  src="/icons/tic.svg"          // ← Aquí pon tu imagen del tick
                  alt="Completado"
                  className="w-6 h-6 object-contain"
                />
              ) : (
                <img
                  src={isCurrent ? stepInfo.activeIcon : stepInfo.icon}
                  alt={stepInfo.label}
                  className="w-5 h-5 object-contain"
                />
              )}
            </div>
            <span className={`text-xs mt-2 font-medium ${
              isCurrent ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {stepInfo.label}
            </span>
          </div>

          {/* Línea conectora */}
          {index < 3 && (
            <div className={`w-20 h-0.5 mt-5 transition-all ${
              step > index + 1 ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
</div>

        {/* ====================== PASO 1: DETALLES ====================== */}
        {/* ====================== PASO 1: DETALLES ====================== */}
{step === 1 && (
  <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
    <h2 className="text-2xl font-semibold mb-6">Completa los detalles de tu sesión</h2>

    {/* Tipo de sesión */}
    <div className="flex gap-1 bg-gray-100 p-1.5 rounded-3xl w-fit mb-8">
      <button
        onClick={() => updateForm('type', 'free-surfers')}
        className={`px-8 py-3.5 rounded-2xl font-medium transition-all ${
          formData.type === 'free-surfers'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'bg-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        Free surfers
      </button>
      <button
        onClick={() => updateForm('type', 'escuelas')}
        className={`px-8 py-3.5 rounded-2xl font-medium transition-all ${
          formData.type === 'escuelas'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'bg-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        Escuelas
      </button>
    </div>

{/* Escuela o Ubicación */}
{formData.type === 'escuelas' ? (
  <div className="mb-6 relative">
    <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
      <Image width={16} height={16} alt='school' src={'/icons/school.svg'}/> 
      Nombre de la Escuela
    </label>
    
    <input
      type="text"
      value={formData.school}
      onChange={(e) => {
        updateForm('school', e.target.value);
        setShowSchoolDropdown(true);
      }}
      onFocus={() => setShowSchoolDropdown(true)}
      onBlur={() => setTimeout(() => setShowSchoolDropdown(false), 200)} // pequeño delay para click
      className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 bg-white"
      placeholder="Busca escuela (ej: Somo's, Sunset...)"
    />
    
    {/* Dropdown */}
    {showSchoolDropdown && formData.school.length > 0 && (
      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-2xl shadow-lg max-h-80 overflow-auto">
        {escuelas
          .filter(item => 
            item.label.toLowerCase().includes(formData.school.toLowerCase()) ||
            item.value.toLowerCase().includes(formData.school.toLowerCase())
          )
          .slice(0, 15)
          .map((item, index) => (
            <div
              key={index}
              onClick={() => {
                updateForm('school', item.value);
                setShowSchoolDropdown(false);   // ← Cierra el dropdown
              }}
              className="px-5 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-none"
            >
              {item.label}
            </div>
          ))}
      </div>
    )}
  </div>
) : (
  <div className="mb-6 relative">
    <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
      <Image width={16} height={16} alt='playa' src={'/icons/playa.svg'}/> 
      Playa
    </label>
    
    <input
      type="text"
      value={formData.location}
      onChange={(e) => {
        updateForm('location', e.target.value);
        setShowBeachDropdown(true);
      }}
      onFocus={() => setShowBeachDropdown(true)}
      onBlur={() => setTimeout(() => setShowBeachDropdown(false), 200)}
      className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 bg-white"
      placeholder="Busca playa (ej: Somo, Zurriola, Langre...)"
    />
    
    {/* Dropdown de playas */}
    {showBeachDropdown && formData.location.length > 0 && (
      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-2xl shadow-lg max-h-80 overflow-auto">
        {playas
          .filter(item => 
            item.label.toLowerCase().includes(formData.location.toLowerCase()) ||
            item.value.toLowerCase().includes(formData.location.toLowerCase())
          )
          .slice(0, 15)
          .map((item, index) => (
            <div
              key={index}
              onClick={() => {
                updateForm('location', item.value);
                setShowBeachDropdown(false);   // ← Cierra el dropdown
              }}
              className="px-5 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-none"
            >
              {item.label}
            </div>
          ))}
      </div>
    )}
  </div>
)}

   {/* Fecha y Hora */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="md:col-span-1">
    <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
      <Image width={16} height={16} alt='fecha' src={'/icons/fecha.svg'}/> 
      Fecha
    </label>
    <input
      type="date"
      value={formData.date}
      onChange={(e) => updateForm('date', e.target.value)}
      max={new Date().toISOString().split('T')[0]}   // ← No permite fechas futuras
      className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
    />
  </div>

  <div>
    <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
      <Image width={16} height={16} alt='hora' src={'/icons/hora.svg'}/> 
      Hora Inicio
    </label>
    <input
      type="time"
      value={formData.startTime}
      onChange={(e) => updateForm('startTime', e.target.value)}
      className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
    />
  </div>

  <div>
    <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
      <Image width={16} height={16} alt='hora' src={'/icons/hora.svg'}/> 
      Hora Fin
    </label>
    <input
      type="time"
      value={formData.endTime}
      onChange={(e) => updateForm('endTime', e.target.value)}
      className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
    />
  </div>
</div>

    
   
  </div>
)}

{/* ====================== PASO 2: FOTOS ====================== */}
{step === 2 && (
  <div className="space-y-6">
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
      <p className="text-blue-800 text-sm">
        Los álbumes permanecen disponibles durante <strong>30 días</strong> después de su publicación.
      </p>
    </div>

    <div className="bg-white border border-gray-200 rounded-3xl p-8">
      <h2 className="text-2xl font-semibold mb-6">Carga tus fotos</h2>
      <p className="text-gray-600 mb-6">La <strong>primera foto</strong> que selecciones será la portada del álbum.</p>

      {/* Drag & Drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
        className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all bg-[#F1F7FE] ${
          isDragging ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input 
          id="fileInput" 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleFileSelect} 
          className="hidden" 
        />
        <div className="mx-auto w-16 h-16 flex items-center justify-center mb-4">
          <span className="text-4xl"><img src='/icons/descargar.svg' alt='img descargar' width={24} height={24}/></span>
        </div>
        <p className="font-medium text-lg">Arrastra tus fotos aquí o haz clic</p>
        <p className="text-gray-500 text-sm mt-1">JPG, PNG, WEBP • Máx 15MB por foto</p>
      </div>

      {/* Previsualización */}
      {photos.length > 0 && (
        <div className="mt-8">
          <p className="text-sm text-gray-600 mb-4 font-medium">
            {photos.length} foto{photos.length !== 1 ? 's' : ''} lista{photos.length !== 1 ? 's' : ''} para subir
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
           {photos.map((photo, index) => (
  <div key={index} className="relative group rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
    <ImageWithLoader
      src={URL.createObjectURL(photo)}
      alt={`preview-${index}`}
      aspectRatio="aspect-square"
    />
    
    {index === 0 && (
      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-3 py-1 rounded font-medium">
        Portada
      </div>
    )}

    <button
      onClick={(e) => { e.stopPropagation(); removePhoto(index); }}
      className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-md opacity-0 group-hover:opacity-100 transition-all"
    >
      ✕
    </button>
  </div>
))}
          </div>
        </div>
      )}

      {/* Fotos ya subidas */}
      {uploadedImages.length > 0 && (
        <div className="mt-10">
          <p className="text-sm text-green-600 font-medium mb-4">
            ✅ Fotos ya subidas ({uploadedImages.length})
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {uploadedImages.map((img, index) => (
  <div key={index} className="relative rounded-2xl overflow-hidden border border-green-300">
    <ImageWithLoader
      src={img.publicUrl}
      alt={`uploaded-${index}`}
      aspectRatio="aspect-square"
    />
    <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded">Subida</div>
  </div>
))}
          </div>
        </div>
      )}
    </div>
  </div>
)}
{/* ====================== PASO 3: PRECIOS ====================== */}
{/* ====================== PASO 3: PRECIOS ====================== */}
{step === 3 && (
  <div className="bg-white border border-gray-200 rounded-3xl p-8">
    <h2 className="text-2xl font-semibold mb-1">Establece tu precio</h2>
    <p className="text-gray-600 mb-6">Elige un precio por foto y activa promociones</p>

    {/* Precio base */}
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={formData.basePrice}
          onChange={(e) => updateForm('basePrice', parseFloat(e.target.value) || 0)}
          className="w-32 text-5xl font-semibold border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500"
          min="1"
          step="0.5"
        />
        <span className="text-5xl text-gray-400">€</span>
      </div>
      <p className="text-sm text-gray-500 mt-2">Precio recomendado: 3€ - 8€ por foto</p>
    </div>

    {/* Comisión */}
    <div className="bg-blue-50 rounded-2xl p-5 mb-8">
      <div className="flex justify-between items-center">
        <p className="font-medium">Comisión Spotshot (25%)</p>
        <div className="text-right">
          <p className="font-medium">Precio final para el cliente</p>
          <p className="text-2xl font-semibold text-emerald-600">€{finalPrice}</p>
        </div>
      </div>
    </div>

    {/* Packs por volumen */}
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Packs por volumen</h3>
        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
          {uploadedImages.length} fotos subidas
        </span>
      </div>

      {uploadedImages.length < 5 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
          <p className="text-amber-800 font-medium">
            Necesitas al menos <strong>5 fotos</strong> para activar packs
          </p>
          <p className="text-amber-700 text-sm mt-2">
            Actualmente tienes {uploadedImages.length} foto{uploadedImages.length !== 1 ? 's' : ''}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {packsCatalog
            .filter(pack => pack.photoQuantity <= uploadedImages.length)
            .map((pack) => (
              <div key={pack.id} className="flex items-center justify-between bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center gap-4">
                  <span className="text-3xl"><img src='/icons/packs.svg' width={20} height={20} alt='foto'/></span>
                  <div>
                    <p className="font-semibold text-lg">{pack.label}</p>
                    <p className="text-sm text-gray-500">
                      {pack.discountPercent}% OFF • {pack.photoQuantity} fotos
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.selectedPacks.includes(pack.id)}
                    onChange={() => togglePack(pack.id)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-7 bg-gray-300 rounded-full peer peer-checked:bg-[#0D2744] transition"></div>
                  <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition peer-checked:translate-x-5"></div>
                </label>
              </div>
            ))}
        </div>
      )}
    </div>

    
  </div>
)}
      {/* ====================== PASO 4: CONFIRMACIÓN ====================== */}
{/* ====================== PASO 4: CONFIRMACIÓN ====================== */}
{/* ====================== PASO 4: CONFIRMACIÓN ====================== */}
{step === 4 && (
  <div className="space-y-8">

    {/* Banner de confirmación */}
    <div className="relative rounded-3xl overflow-hidden h-80">
      <img src="/banner-surf.png" alt="Sesión" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute bottom-8 left-8 text-white">
        <p className="text-4xl font-bold">
          {formData.date ? new Intl.DateTimeFormat('es-ES', { 
            weekday: 'long', 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
          }).format(new Date(formData.date)) : 'Tu Sesión'}
        </p>
        <p className="text-2xl mt-1">
          {formData.location || formData.school || 'Ubicación'}
        </p>
      </div>
    </div>

    {/* Precio y Packs */}
    <div className="bg-white border border-gray-100 rounded-3xl p-8">
      <h3 className="text-2xl font-semibold mb-2">Precio por foto</h3>
      <p className="text-5xl font-bold text-gray-900">€{formData.basePrice}</p>

      <div className="mt-8">
        <p className="font-medium mb-4">Packs activos</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.selectedPacks.length > 0 ? (
            formData.selectedPacks.map((packId) => {
              const pack = packsCatalog.find(p => p.id === packId);
              return pack ? (
                <div key={pack.id} className="border border-gray-200 rounded-2xl p-5 bg-green-50">
                  <p className="font-semibold">{pack.label}</p>
                  <p className="text-sm text-green-700">
                    {pack.discountPercent}% OFF • {pack.photoQuantity} fotos
                  </p>
                </div>
              ) : null;
            })
          ) : (
            <p className="text-gray-500 italic">No se seleccionaron packs</p>
          )}
        </div>
      </div>
    </div>

    {/* Fotos subidas */}
    {/* Fotos subidas */}
<div>

  <p className="text-sm text-gray-600 mb-4 font-medium">
    {uploadedImages.length} foto{uploadedImages.length !== 1 ? 's' : ''} subidas
  </p>
   <p className="text-xs text-gray-400 mt-1">*No hace falta esperar a que termine el proceso de carga.</p>
  
  {uploadedImages.length > 0 ? (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {uploadedImages.map((img, index) => (
        <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-green-200">
          <ImageWithLoader
            src={img.publicUrl}
            alt={`foto-${index}`}
            aspectRatio="aspect-square"
          />
          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
            Subida
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-red-600 text-center py-8 bg-red-50 rounded-2xl">
      ⚠️ Debes subir al menos una foto antes de publicar
    </p>
  )}
</div>
  </div>
)}

        {/* Botones */}
{/* ====================== BOTONES INFERIORES ====================== */}
<div className="flex justify-between items-center mt-8">
  

  <div className="flex gap-4">
    {step > 1 && (
      <button
        onClick={handleBack}
        className="px-8 py-3.5 rounded-2xl border border-gray-300 hover:bg-gray-50 font-medium flex items-center gap-2"
      >
        ← Atrás
      </button>
    )}

    <button
      onClick={handleNext}
      disabled={
        (step === 1 && creatingSession) || 
        (step === 2 && uploading) || 
        (step === 3 && updatingPrice) ||
        (step === 4 && publishing)
      }
      className="px-8 py-3.5 rounded-2xl bg-gray-900 text-white hover:bg-black flex items-center gap-2 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {step === 1 && creatingSession ? 'Creando sesión...' :
       step === 2 && uploading ? 'Subiendo fotos...' :
       step === 3 && updatingPrice ? 'Guardando precio...' :
       step === 4 && publishing ? 'Publicando...' :
       step === 4 ? 'Publicar Sesión' : 'Siguiente →'}
    </button>
  </div>
</div>
{/* ==================== MODAL PUBLICAR ==================== */}
{showPublishModal && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center">
      <h3 className="text-2xl font-semibold mb-4">¿Publicar la sesión?</h3>
      <p className="text-gray-600 mb-8">
        Una vez publicada, será visible para todos los usuarios<br />
        y estará disponible durante 30 días. ¿Deseas continuar?
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => setShowPublishModal(false)}
          className="flex-1 py-3.5 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={confirmPublish}
          disabled={publishing}
          className="flex-1 py-3.5 bg-gray-900 text-white rounded-2xl font-medium hover:bg-black disabled:opacity-70"
        >
          {publishing ? 'Publicando...' : 'Publicar'}
        </button>
      </div>
    </div>
  </div>
)}
{showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full mx-4 text-center">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-5xl">🎉</span>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              ¡Sesión publicada con éxito!
            </h2>
            
            <p className="text-gray-600 mb-8">
              Tu álbum ya está visible para todos los usuarios.<br />
              ¡Muchas gracias por compartir tu arte!
            </p>

            <button
              onClick={handleGoToMySessions}
              className="w-full py-4 bg-[#106BB9] hover:bg-blue-700 text-white font-semibold rounded-2xl transition"
            >
              Ver mis sesiones
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default NewAlbumPage;