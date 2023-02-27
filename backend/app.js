const express = require('express')
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.HOST,
    port: process.env.PORT,
    user: 'postgres',
    password: process.env.PASSWORD,
    database: 'postgres'
  }
  // connection: {
  //   host: 'localhost',
  //   port: 5432,
  //   user: 'postgres',
  //   password: '123456',
  //   database: 'postgres'
  // }
});
const app = express()
const port = 3002

async function busqueMeusFilmes(filtrosConsulta = null) {
  try {
    let rawSql = ``
    let paginacao = ``
    let filtros = {}

    if (filtrosConsulta) {
      if (filtrosConsulta.limit) filtros.limit = filtrosConsulta.limit
      if (filtrosConsulta.offset) filtros.offset = filtrosConsulta.offset
      if (filtrosConsulta.orderBy) filtros.orderBy = filtrosConsulta.orderBy
      if (filtrosConsulta.key) filtros.key = filtrosConsulta.key
      if (filtrosConsulta.periodoInicio) filtros.periodoInicio = filtrosConsulta.periodoInicio
      if (filtrosConsulta.periodoFim) filtros.periodoFim = filtrosConsulta.periodoFim
      if (filtrosConsulta.ano) filtros.ano = filtrosConsulta.ano
      if (filtrosConsulta.mes) filtros.mes = filtrosConsulta.mes
      if (filtrosConsulta.dia) filtros.dia = filtrosConsulta.dia
      if (filtrosConsulta.id) filtros.id = filtrosConsulta.id
      if (filtrosConsulta.rangeAvaliacaoInicio) filtros.rangeAvaliacaoInicio = filtrosConsulta.rangeAvaliacaoInicio
      if (filtrosConsulta.rangeAvaliacaoFim) filtros.rangeAvaliacaoFim = filtrosConsulta.rangeAvaliacaoFim
      if (filtrosConsulta.avaliacaoMaiorQue) filtros.avaliacaoMaiorQue = filtrosConsulta.avaliacaoMaiorQue
      if (filtrosConsulta.avaliacaoMenorQue) filtros.avaliacaoMenorQue = filtrosConsulta.avaliacaoMenorQue
      if (filtrosConsulta.avaliacaoIgualA) filtros.avaliacaoIgualA = filtrosConsulta.avaliacaoIgualA
      filtrosConsulta.crescente && Number(filtrosConsulta.crescente) === 1 ? filtros.crescente = 'ASC' : filtros.crescente = ''
    }
    // SELECT
    if (filtros && filtros.key) {
      rawSql += `\nSELECT ${filtros.key.join(' , ')} FROM public.filmes\n`
    } else {
      rawSql += `\nSELECT * FROM public.filmes\n `
    }
    // WHERE
    let where = ``
    if (filtros.periodoInicio && filtros.periodoFim) {
      !where.length ? where += '\n WHERE ' : where += '\n AND '
      where += `\n release_date BETWEEN '${filtros.periodoInicio}' AND '${filtros.periodoFim}'\n`
    }
    if (filtros.ano) {
      !where.length ? where += '\n WHERE ' : where += '\n AND '
      where += `\n  EXTRACT (year FROM release_date) = ${filtros.ano} \n`
    }
    if (filtros.mes) {
      !where.length ? where += '\n WHERE ' : where += '\n AND '
      where += `\n  EXTRACT (month FROM release_date) = ${filtros.mes} \n`
    }
    if (filtros.dia) {
      !where.length ? where += '\n WHERE ' : where += '\n AND '
      where += `\n  EXTRACT (day FROM release_date) = ${filtros.dia} \n`
    }
    if (filtros.dia) {
      !where.length ? where += '\n WHERE ' : where += '\n AND '
      where += `\n  EXTRACT (day FROM release_date) = ${filtros.dia} \n`
    }
    if (filtros.id) {
      where = `\n WHERE id in(${filtros.id.join(' , ')}) \n`
    }
    if (filtros.avaliacaoIgualA) {
      !where.length ? where += '\n WHERE ' : where += '\n AND '
      where += `\n round(vote_average) = ${filtros.avaliacaoIgualA} \n`
    } else {
      if (filtros.rangeAvaliacaoInicio && filtros.rangeAvaliacaoFim) {
        !where.length ? where += '\n WHERE ' : where += '\n AND '
        where += `\n vote_average BETWEEN round(${filtros.rangeAvaliacaoInicio}) AND round(${filtros.rangeAvaliacaoFim})\n`
      }
      if (filtros.avaliacaoMenorQue && filtros.avaliacaoMaiorQue) {
        where += ''
      } else if (filtros.avaliacaoMaiorQue) {
        !where.length ? where += '\n WHERE ' : where += '\n AND '
        where += `\nround(vote_average) > ${filtros.avaliacaoMaiorQue} \n`
      } else if (filtros.avaliacaoMenorQue) {
        !where.length ? where += '\n WHERE ' : where += '\n AND '
        where += `\nround(vote_average) < ${filtros.avaliacaoMenorQue} \n`
      }
    }
    // ORDENAÇÃO
    let ordenacao = ``
    if (filtros && filtros.orderBy) {
      ordenacao += `\n ORDER BY ${filtros.orderBy} ${filtros.crescente} \n`
    }
    // PAGINAÇÃO
    if (filtros.limit && filtros.offset) paginacao += `
      \nOFFSET ${filtros.offset} ROWS
      FETCH NEXT ${filtros.limit} ROWS ONLY\n
    `
    const dados = await knex.raw(`
    ${rawSql}
    ${where}
    ${ordenacao}
    ${paginacao}
    `)

    return dados
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}

app.get('/', async (req, res) => {
  res.send(`API rodando na porta: ${port}`)
})
app.get('/buscar', async (req, res) => {
  try {
    const dados = await busqueMeusFilmes(req.query)
    res.json(dados)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
})
app.get('/exibir', async (req, res) => {
  try {
    if (!req.query.id) throw new Error(JSON.stringify({ msg: 'informe o Id' }))
    const dados = await knex('filmes').whereIn('id', req.query.id)
    res.json(dados)
  } catch (error) {
    const meuErro = JSON.parse(error.message);
    console.error(meuErro.prop);
    res.status(500).send(meuErro)
  }
})

app.listen(port, () => {
  console.log(`API rodando na porta: ${port}`)
})
