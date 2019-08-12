use [bd_encuestas]
GO

/*SELECT 	
	encuestas.[ID], encuestas.[Activa], encuestas.[Color], encuestas.[Creada], encuestas.[Modificada], encuestas.[Imagen], COUNT(respuestas.[ID]) as Total,
	(
		SELECT preguntas.[ID], preguntas.[Titulo], cat_tipo_pregunta.[Titulo] as Tipo,
		preguntas.[Activo],
		JSON_QUERY(REPLACE(
			REPLACE(
				(
					SELECT opciones.[Titulo]
					FROM opciones
					WHERE preguntas.[ID] = opciones.[pregunta_id]
					ORDER BY opciones.Orden ASC
					FOR JSON PATH
				)
			, '{"Titulo":','')
		, '"}','"')) AS Opciones
		FROM [preguntas] preguntas
		INNER JOIN cat_tipo_pregunta
		ON cat_tipo_pregunta.ID = preguntas.cat_tipo_pregunta
		WHERE preguntas.[encuesta_id] = encuestas.[ID]
		ORDER BY preguntas.Orden ASC
		FOR JSON PATH
	) Preguntas
FROM [encuestas] encuestas
LEFT JOIN respuestas
ON respuestas.[encuesta_id] = encuestas.[ID]
GROUP BY encuestas.[ID], encuestas.[Activa], encuestas.[Color], encuestas.[Creada], encuestas.[Modificada], encuestas.[Imagen]
FOR JSON PATH*/

/*select * from respuestas
pivot ( 
  count(*) for pregunta in ( 'Gold' gold, 'Silver' silver, 'Bronze' bronze )
)
order by noc*/

/*select * 
from (
	select distinct respuestas.respuesta_id as 'ID', preguntas.Titulo from respuestas
	inner join preguntas
	on preguntas.id = respuestas.pregunta_id
) preguntas
pivot (
	count(Titulo)
	for Titulo in ([¿Qué es un Choice Question?])
) as pivotTable*/

/*select respuestas.*, preguntas.Titulo from respuestas
inner join preguntas
on preguntas.ID = respuestas.pregunta_id*/
/*pivot ( 
  count(Titulo) for Titulo in ([¿Qué es un Choice Question?])
) piv*/

DECLARE 
    @columns NVARCHAR(MAX) = '',
	@sql     NVARCHAR(MAX) = '';
SELECT 
    @columns += QUOTENAME(respuestas.Titulo) + ','
FROM 
    (select distinct respuestas.pregunta_id as 'ID', preguntas.Titulo from respuestas
	inner join preguntas
	on preguntas.id = respuestas.pregunta_id) respuestas
ORDER BY 
    respuestas.ID;
SET @columns = LEFT(@columns, LEN(@columns) - 1);
PRINT @columns;

-- construct dynamic SQL
SET @sql ='
WITH resp AS (
   SELECT
      R.respuesta_id,
      P.Titulo
   FROM
      respuestas R
      INNER JOIN preguntas P
         ON P.ID = R.pregunta_id
)
SELECT *
FROM resp
   PIVOT (
		count(Titulo) for Titulo in ('+ @columns +')
   ) P
;';
 
-- execute the dynamic SQL
EXECUTE sp_executesql @sql;