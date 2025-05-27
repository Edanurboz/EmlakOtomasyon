import React, { useContext, useState } from "react";
import Searchbar from "../components/Searchbar";
import useProperties from "../hooks/useProperties";
import { PuffLoader } from "react-spinners"
import Item from "../components/item";
import UserDetailContext from "../context/UserDetailContext";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { deleteResidency, updateResidency, getPropertyBookings } from "../utils/api";
import { toast } from "react-toastify";
import { Button, Modal, TextInput, Textarea, NumberInput, Select, Alert, Table } from "@mantine/core";
import { useForm } from "@mantine/form";

const MyListings = () => {
  const [filter, setFilter] = useState("");
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [reservationsModalOpened, setReservationsModalOpened] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const { data, isError, isLoading, refetch } = useProperties();
  const {userDetails: {listings, token}, setUserDetails} = useContext(UserDetailContext);
  const {user} = useAuth0();
  const queryClient = useQueryClient();

  // Fetch reservations for the selected property
  const { data: propertyReservations } = useQuery({
    queryKey: ['propertyReservations', selectedProperty?.id],
    queryFn: () => getPropertyBookings(selectedProperty?.id),
    enabled: !!selectedProperty?.id && reservationsModalOpened
  });

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      price: '',
      address: '',
      city: '',
      country: '',
      facilities: {
        bedrooms: 0,
        bathrooms: 0,
        parkings: 0
      }
    }
  });

  const {mutate: deleteMutation} = useMutation({
    mutationFn: (id) => deleteResidency(id, user?.email, token),
    onSuccess: () => {
      toast.success("İlan başarıyla silindi");
      queryClient.invalidateQueries("userListings");
      queryClient.invalidateQueries("allProperties");
      refetch();
      setDeleteModalOpened(false);
    }
  });

  const {mutate: updateMutation} = useMutation({
    mutationFn: (values) => updateResidency(selectedProperty.id, values, user?.email, token),
    onSuccess: () => {
      toast.success("İlan başarıyla güncellendi");
      queryClient.invalidateQueries("userListings");
      queryClient.invalidateQueries("allProperties");
      refetch();
      setEditModalOpened(false);
    }
  });

  const handleDelete = (id) => {
    setSelectedProperty({ id });
    setDeleteModalOpened(true);
  };

  const handleEdit = (property) => {
    setSelectedProperty(property);
    form.setValues({
      title: property.title,
      description: property.description,
      price: property.price,
      address: property.address,
      city: property.city,
      country: property.country,
      facilities: property.facilities
    });
    setEditModalOpened(true);
  };

  const handleShowReservations = (property) => {
    setSelectedProperty(property);
    setReservationsModalOpened(true);
  };

  if(isError){
    return(
      <div>
        <span>Error while fetching data</span>
      </div>
    )
  }
  if(isLoading){
    return (
      <div className="h-64 flexCenter">
        <PuffLoader 
        height = "80"
        width = "80"
        radius = {1}
        color = "#555"
        aria-label="puff-loading"
        />
      </div>
    )
  }

  return (
    <main className="my-24">
      <div className="max-padd-container py-10 bg-gradient-to-r from-primary via-white to-white">
        <div>
          <Searchbar filter={filter} setFilter={setFilter} />
          {/* CONTAINER  */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-10">
            {data.filter((property) => 
              listings?.map((listing) => listing.id).includes(property.id)
            ).filter((property) =>
              property.title.toLowerCase().includes(filter.toLowerCase()) ||
              property.city.toLowerCase().includes(filter.toLowerCase()) ||
              property.country.toLowerCase().includes(filter.toLowerCase()) 
            ).map((property) => (
              <div key={property.id} className="relative">
                <Item property={property} />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button 
                    size="sm" 
                    color="blue" 
                    onClick={() => handleEdit(property)}
                  >
                    Düzenle
                  </Button>
                  <Button 
                    size="sm" 
                    color="red" 
                    onClick={() => handleDelete(property.id)}
                  >
                    Sil
                  </Button>
                  <Button 
                    size="sm" 
                    color="green" 
                    onClick={() => handleShowReservations(property)}
                  >
                    Rezervasyonlar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        title="İlanı Düzenle"
        size="lg"
      >
        <form onSubmit={form.onSubmit((values) => {
          updateMutation(values);
        })}>
          <TextInput
            label="Başlık"
            placeholder="İlan başlığı"
            required
            {...form.getInputProps('title')}
          />
          <Textarea
            label="Açıklama"
            placeholder="İlan açıklaması"
            required
            mt="md"
            {...form.getInputProps('description')}
          />
          <NumberInput
            label="Fiyat"
            placeholder="İlan fiyatı"
            required
            mt="md"
            {...form.getInputProps('price')}
          />
          <TextInput
            label="Adres"
            placeholder="İlan adresi"
            required
            mt="md"
            {...form.getInputProps('address')}
          />
          <TextInput
            label="Şehir"
            placeholder="Şehir"
            required
            mt="md"
            {...form.getInputProps('city')}
          />
          <TextInput
            label="Ülke"
            placeholder="Ülke"
            required
            mt="md"
            {...form.getInputProps('country')}
          />
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Özellikler</h3>
            <div className="grid grid-cols-3 gap-4">
              <NumberInput
                label="Yatak Odası"
                {...form.getInputProps('facilities.bedrooms')}
              />
              <NumberInput
                label="Banyo"
                {...form.getInputProps('facilities.bathrooms')}
              />
              <NumberInput
                label="Park Yeri"
                {...form.getInputProps('facilities.parkings')}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={() => setEditModalOpened(false)}>
              İptal
            </Button>
            <Button type="submit">
              Kaydet
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="İlanı Sil"
        size="md"
      >
        <Alert title="Dikkat!" color="red" mb="md">
          Bu ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
        </Alert>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setDeleteModalOpened(false)}>
            İptal
          </Button>
          <Button 
            color="red" 
            onClick={() => deleteMutation(selectedProperty?.id)}
          >
            Sil
          </Button>
        </div>
      </Modal>

      {/* Reservations Modal */}
      <Modal
        opened={reservationsModalOpened}
        onClose={() => setReservationsModalOpened(false)}
        title={
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold text-tertiary">{selectedProperty?.title}</span>
            <span className="text-sm text-gray-30">- Rezervasyonlar</span>
          </div>
        }
        size="lg"
        classNames={{
          title: "text-xl font-semibold",
          header: "border-b border-gray-10 pb-4",
          body: "pt-4"
        }}
      >
        {propertyReservations && propertyReservations.length > 0 ? (
          <div className="space-y-4">
            <div className="bg-primary p-4 rounded-lg">
              <p className="text-sm text-tertiary">
                Bu ilan için toplam {propertyReservations.length} rezervasyon bulunmaktadır.
              </p>
            </div>
            <div className="overflow-x-auto">
              <Table striped highlightOnHover>
                <thead>
                  <tr>
                    <th className="bg-primary text-tertiary text-left py-3 px-4">Kullanıcı E-postası</th>
                    <th className="bg-primary text-tertiary text-left py-3 px-4">Başlangıç Tarihi</th>
                    <th className="bg-primary text-tertiary text-left py-3 px-4">Bitiş Tarihi</th>
                  </tr>
                </thead>
                <tbody>
                  {propertyReservations.map((reservation, index) => (
                    <tr key={index} className="hover:bg-primary/50 transition-colors">
                      <td className="font-medium text-tertiary py-3 px-4">{reservation.userEmail}</td>
                      <td className="text-gray-30 py-3 px-4">{reservation.startDate}</td>
                      <td className="text-gray-30 py-3 px-4">{reservation.endDate}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-primary p-6 rounded-lg">
              <Alert 
                title="Bilgi" 
                color="blue"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              >
                Bu ilan için henüz rezervasyon yapılmamış.
              </Alert>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
};

export default MyListings; 