import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeletarFuncComponent } from '../../components/deletar-func/deletar-func.component';
import { FormFuncionarioComponent } from '../../components/form-funcionario/form-funcionario.component';
import { Funcionario } from '../../models/funcionario';
import { FuncionarioService } from '../../services/funcionario.service';

@Component({
  selector: 'app-listar-funcionarios',
  templateUrl: './listar-funcionarios.component.html',
  styleUrls: ['./listar-funcionarios.component.css']
})
export class ListarFuncionariosComponent implements OnInit {

  funcionarios: Funcionario[] = []

  colunas: Array<string> = [
    'id',
    'nome',
    'email',
    'actions'
  ]

  constructor(
    private funcService: FuncionarioService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {    
    this.recuperarFuncionarios()
    
  }

  deletarFuncionario(func: Funcionario): void {
    const dialogRef = this.dialog.open(DeletarFuncComponent)

    // a funcao afterCLosed() te retorna um observable que manda os dados q serao enviados pra vc quando esse dialog for fechado
    dialogRef.afterClosed().subscribe(
      (boolean) => {
        if(boolean){
          this.funcService.deleteFuncionario(func).subscribe(
            (funcs) => {
              this.recuperarFuncionarios()
              this.snackBar.open("Funcionario deletado com sucesso!", 'Ok', {
                duration: 3000
              })
            }
          )
        }
      }
    )    
  }

  recuperarFuncionarios(): void {
    this.funcService.getFuncionarios().subscribe(
      (funcs) => { //sucesso
        this.funcionarios = funcs.reverse()
      },
      (erro) => { // erro
        console.log(erro)
      },
      () => { // complete
        console.log('Dados enviados com sucesso')
      }
    )
  }

  abrirFormFuncionario(): void {
    // abrindo o formulario do funcioanrio e recuperando a referencia desse dialog e guardando a variavel
    const referenciaDialog = this.dialog.open(FormFuncionarioComponent)

    // a funcao afterclosed() nos retorna um observable que notifica quando o dialog acabou de ser fechado
    // quando o dialog for fechado, chamaremos a funcao que faz a requisicao dos funcionarios novamente
    referenciaDialog.afterClosed().subscribe(
      () => {
        this.recuperarFuncionarios()
      }
    )
  }



}
