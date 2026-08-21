import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
//Atualizado 
export type PedidoPendente = {
  id: string;
  cliente: string;
  produto: string;
  valor: string;
  status: string;
};

export type UsuarioCadastrado = {
  id: string;
  email: string;
  perfil: string;
};

@Injectable({ providedIn: 'root' })
export class PainelAdminMockService {
  private readonly pedidosPendentes: PedidoPendente[] = [
    {
      id: 'PED-1042',
      cliente: 'joao.silva@email.com',
      produto: 'Cyberpunk 2077',
      valor: 'R$ 99,95',
      status: 'Aguardando pagamento',
    },
    {
      id: 'PED-1043',
      cliente: 'maria.souza@email.com',
      produto: 'God of War Ragnarök',
      valor: 'R$ 199,90',
      status: 'Processando',
    },
    {
      id: 'PED-1044',
      cliente: 'carlos.lima@email.com',
      produto: 'Red Dead Redemption 2',
      valor: 'R$ 98,96',
      status: 'Aguardando envio de chave',
    },
  ];

  private readonly usuariosCadastrados: UsuarioCadastrado[] = [
    { id: 'U-01', email: 'admin@email.com', perfil: 'Administrador' },
    { id: 'U-02', email: 'joao.silva@email.com', perfil: 'Usuário' },
    { id: 'U-03', email: 'maria.souza@email.com', perfil: 'Usuário' },
    { id: 'U-04', email: 'carlos.lima@email.com', perfil: 'Usuário' },
    { id: 'U-05', email: 'ana.pereira@email.com', perfil: 'Usuário' },
    { id: 'U-06', email: 'pedro.rocha@email.com', perfil: 'Usuário' },
    { id: 'U-07', email: 'beatriz.alves@email.com', perfil: 'Usuário' },
    { id: 'U-08', email: 'lucas.fernandes@email.com', perfil: 'Usuário' },
  ];

  obterPedidosPendentes(): Observable<PedidoPendente[]> {
    return of(this.pedidosPendentes);
  }

  obterUsuariosCadastrados(): Observable<UsuarioCadastrado[]> {
    return of(this.usuariosCadastrados);
  }
}
