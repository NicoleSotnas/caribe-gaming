// Substitui o User do Firebase. Mesmos campos que a Facade/templates já usam.
export interface UsuarioApp {
  uid: string;
  email: string | null;
  displayName: string | null;
}