export type AddressData = {
  zip_code: string;
  street: string;
  address_number: string;
  address_complement: string;
  neighborhood: string;
  city: string;
  state: string;
};

type ViaCepResponse = {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

export function formatZipCode(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

export function formatAddress(address: AddressData) {
  const street = [address.street, address.address_number].filter(Boolean).join(", ");
  const locality = [address.neighborhood, address.city, address.state].filter(Boolean).join(" - ");
  return [street, address.address_complement, locality, address.zip_code ? `CEP ${formatZipCode(address.zip_code)}` : ""].filter(Boolean).join(" · ");
}

export async function findAddressByZipCode(value: string): Promise<Partial<AddressData>> {
  const zipCode = value.replace(/\D/g, "");
  if (zipCode.length !== 8) throw new Error("Informe um CEP com 8 números.");
  const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
  if (!response.ok) throw new Error("Não foi possível consultar o CEP.");
  const data = await response.json() as ViaCepResponse;
  if (data.erro) throw new Error("CEP não encontrado.");
  return {
    zip_code: zipCode,
    street: data.logradouro ?? "",
    address_complement: data.complemento ?? "",
    neighborhood: data.bairro ?? "",
    city: data.localidade ?? "",
    state: data.uf ?? "",
  };
}
